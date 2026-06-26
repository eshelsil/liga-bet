<?php

namespace App\Actions;

use App\BracketGame;
use App\BracketSlot;
use App\Competition;
use App\DataCrawler\Bracket;
use App\DataCrawler\BracketSource;
use App\DataCrawler\BracketTie;
use App\DataCrawler\Crawler;
use App\Enums\GameSubTypes;
use App\Game;
use Illuminate\Support\Facades\Log;

/**
 * Build the knockout bracket for a competition from 365scores /brackets, then keep it enriched.
 *
 * The topology is built ONCE: ties, slot sources, feed/dest edges and sides. Once a stored FINAL tie
 * exists the structure is FROZEN — later runs only enrich the mutable fields (slot teams, start_time,
 * and the 365 game id / game_id link, set once and never overwritten). This protects the bracket from
 * 365 renumbering stage/group ids or churning game ids after it's established.
 *
 * Only invoked for competitions whose config enables a bracket (see UpdateCompetition).
 */
class UpdateCompetitionBracket
{
    private ?Bracket $fakeBracket = null;

    public function fake(?Bracket $bracket = null): void
    {
        $this->fakeBracket = $bracket;
    }

    public function handle(Competition $competition): void
    {
        $bracket = $this->fakeBracket ?? $competition->getCrawler()->fetchBracket($competition->get365Id());
        if (!$bracket || empty($bracket->ties)) {
            Log::debug("[UpdateCompetitionBracket] No bracket data for competition {$competition->id}");
            return;
        }

        $competition->load(['teams', 'groups', 'games']);

        // 365 team id -> our teams.id (invert Crawler::translate365TeamId over our teams).
        $teamIdBy365 = $competition->teams
            ->mapWithKeys(fn ($t) => [Crawler::translate365TeamId($t->external_id) => $t->id]);
        $groupIdByExtId = $competition->groups->pluck('id', 'external_id');
        // our matches keyed by sub_type + unordered team pair, for linking game_id (fallback).
        $gameIdByKey = $competition->games->mapWithKeys(
            fn (Game $g) => [$this->gameKey($g->sub_type, $g->team_home_id, $g->team_away_id) => $g->id]
        );
        // preferred link: shared 365 game id (for 365-sourced comps, matches.external_id == BracketGame.external_id).
        $gameIdByExternalId = $competition->games->pluck('id', 'external_id');

        // Structure is built once. Once a FINAL tie is stored the topology is complete and frozen —
        // from then on we only enrich mutable fields (teams, start_time, id links), never the structure.
        $structureFrozen = BracketGame::where('competition_id', $competition->id)
            ->where('sub_type', GameSubTypes::FINAL)
            ->exists();
        if ($structureFrozen) {
            $this->enrich($competition, $bracket, $teamIdBy365, $gameIdByExternalId, $gameIdByKey, $groupIdByExtId);
            return;
        }

        // --- pass 1: upsert ties + slots (resolve group_id / team_id) ---
        /** @var BracketTie $tie */
        foreach ($bracket->ties as $tie) {
            $bracketGame = BracketGame::updateOrCreate(
                [
                    'competition_id' => $competition->id,
                    'stage_num'      => $tie->stageNum,
                    'group_num'      => $tie->groupNum,
                ],
                [
                    'sub_type'       => $tie->subType,
                    'match_label'    => $tie->matchLabel,
                    'start_time'     => $tie->startTime,
                    'external_id'    => $tie->external365GameId,
                    'dest_stage_num' => $tie->destStageNum,
                    'dest_group_num' => $tie->destGroupNum,
                ]
            );

            foreach ([$tie->home, $tie->away] as $source) {
                $this->upsertSlot($bracketGame, $source, $teamIdBy365, $groupIdByExtId);
            }
        }

        // --- pass 2: resolve cross-tie links (feeds_from + game_id) now that all ties exist ---
        $byCoords = BracketGame::where('competition_id', $competition->id)
            ->with('slots')
            ->get()
            ->keyBy(fn (BracketGame $bg) => $this->coordKey($bg->stage_num, $bg->group_num));

        foreach ($byCoords as $bracketGame) {
            foreach ($bracketGame->slots as $slot) {
                if (in_array($slot->kind, [BracketSlot::KIND_MATCH_WINNER, BracketSlot::KIND_MATCH_LOSER], true)
                    && $slot->origin_stage_num !== null) {
                    $feeder = $byCoords->get($this->coordKey($slot->origin_stage_num, $slot->origin_group_num));
                    if ($feeder && $slot->feeds_from_game_id !== $feeder->id) {
                        $slot->feeds_from_game_id = $feeder->id;
                        $slot->save();
                    }
                }
            }

            // link to our playable Game: prefer the shared 365 game id, fall back to sub_type + team pair.
            if (is_null($bracketGame->game_id)) {
                $gameId = $bracketGame->external_id ? $gameIdByExternalId->get($bracketGame->external_id) : null;
                if (!$gameId) {
                    $home = $bracketGame->slots->firstWhere('slot_num', 1);
                    $away = $bracketGame->slots->firstWhere('slot_num', 2);
                    if ($home?->team_id && $away?->team_id) {
                        $gameId = $gameIdByKey->get($this->gameKey($bracketGame->sub_type, $home->team_id, $away->team_id));
                    }
                }
                if ($gameId) {
                    $bracketGame->game_id = $gameId;
                    $bracketGame->save();
                }
            }
        }

        $this->computeAndPersistSides($byCoords);
    }

    /**
     * Frozen-structure path: update only the mutable fields. Never adds/removes ties, never touches
     * stage/group/dest/origin/sub_type/feeds_from/side, and never overwrites an already-set id.
     */
    private function enrich(Competition $competition, Bracket $bracket, $teamIdBy365, $gameIdByExternalId, $gameIdByKey, $groupIdByExtId): void
    {
        $stored = BracketGame::where('competition_id', $competition->id)
            ->with('slots')
            ->get()
            ->keyBy(fn (BracketGame $bg) => $this->coordKey($bg->stage_num, $bg->group_num));

        /** @var BracketTie $tie */
        foreach ($bracket->ties as $tie) {
            $bracketGame = $stored->get($this->coordKey($tie->stageNum, $tie->groupNum));
            if (!$bracketGame) {
                continue; // structure frozen: ignore ties not already stored
            }

            $dirty = false;
            if ($tie->startTime !== null && $bracketGame->start_time !== $tie->startTime) {
                $bracketGame->start_time = $tie->startTime;
                $dirty = true;
            }
            // 365 game id: set once, never overwrite.
            if (is_null($bracketGame->external_id) && $tie->external365GameId !== null) {
                $bracketGame->external_id = $tie->external365GameId;
                $dirty = true;
            }
            if ($dirty) {
                $bracketGame->save();
            }

            // slot updates: fill teams as participants resolve, and backfill a first-round slot's
            // group link if it was never set. Config is otherwise frozen — this only fills nulls
            // (a slot that wasn't saved with its group), it never overwrites established config.
            foreach ([$tie->home, $tie->away] as $source) {
                $slot = $bracketGame->slots->firstWhere('slot_num', $source->slotNum);
                if (!$slot) {
                    continue;
                }
                $dirtySlot = false;

                $teamId = $source->team365Id ? $teamIdBy365->get($source->team365Id) : null;
                if ($teamId !== null && $slot->team_id !== $teamId) {
                    $slot->team_id = $teamId;
                    $dirtySlot = true;
                }

                if ($slot->kind === BracketSlot::KIND_GROUP_POSITION && is_null($slot->group_id)
                    && $source->groupExternalId && ($gid = $groupIdByExtId->get($source->groupExternalId))) {
                    $slot->group_id = $gid;
                    if (is_null($slot->origin_position) && $source->originPosition !== null) {
                        $slot->origin_position = $source->originPosition;
                    }
                    $dirtySlot = true;
                }

                if ($dirtySlot) {
                    $slot->save();
                }
            }

            // link the playable game once it exists; set once, never overwrite.
            if (is_null($bracketGame->game_id)) {
                $gameId = $bracketGame->external_id ? $gameIdByExternalId->get($bracketGame->external_id) : null;
                if (!$gameId) {
                    $home = $bracketGame->slots->firstWhere('slot_num', 1);
                    $away = $bracketGame->slots->firstWhere('slot_num', 2);
                    if ($home?->team_id && $away?->team_id) {
                        $gameId = $gameIdByKey->get($this->gameKey($bracketGame->sub_type, $home->team_id, $away->team_id));
                    }
                }
                if ($gameId) {
                    $bracketGame->game_id = $gameId;
                    $bracketGame->save();
                }
            }
        }
    }

    private function upsertSlot(BracketGame $bracketGame, BracketSource $source, $teamIdBy365, $groupIdByExtId): void
    {
        BracketSlot::updateOrCreate(
            ['bracket_game_id' => $bracketGame->id, 'slot_num' => $source->slotNum],
            [
                'kind'             => $source->kind,
                'origin_stage_num' => $source->originStageNum,
                'origin_group_num' => $source->originGroupNum,
                'origin_position'  => $source->originPosition,
                'symbolic_name'    => $source->symbolicName,
                'allowed_groups'   => $source->allowedGroups,
                'group_id'         => $source->groupExternalId ? $groupIdByExtId->get($source->groupExternalId) : null,
                'team_id'          => $source->team365Id ? $teamIdBy365->get($source->team365Id) : null,
            ]
        );
    }

    /**
     * Side = which half of the bracket a tie sits in. The Final's two source ties define left/right;
     * every other tie inherits the side of the tie its winner advances into. Final & 3rd place = null.
     *
     * @param \Illuminate\Support\Collection $byCoords  coordKey => BracketGame (with slots loaded)
     */
    private function computeAndPersistSides($byCoords): void
    {
        $final = $byCoords->first(fn (BracketGame $bg) => $bg->sub_type === GameSubTypes::FINAL);
        if (!$final) {
            return;
        }
        $homeSrc = $final->slots->firstWhere('slot_num', 1);
        $awaySrc = $final->slots->firstWhere('slot_num', 2);
        $leftRoot  = $homeSrc ? $this->coordKey($homeSrc->origin_stage_num, $homeSrc->origin_group_num) : null;
        $rightRoot = $awaySrc ? $this->coordKey($awaySrc->origin_stage_num, $awaySrc->origin_group_num) : null;

        $finalKey = $this->coordKey($final->stage_num, $final->group_num);
        $memo = [];

        $sideOf = function (BracketGame $bg) use (&$sideOf, &$memo, $byCoords, $finalKey, $leftRoot, $rightRoot) {
            $key = $this->coordKey($bg->stage_num, $bg->group_num);
            if (array_key_exists($key, $memo)) {
                return $memo[$key];
            }
            if (is_null($bg->dest_stage_num)) {
                return $memo[$key] = null; // Final / 3rd place
            }
            $memo[$key] = null; // guard against cycles
            $destKey = $this->coordKey($bg->dest_stage_num, $bg->dest_group_num);
            if ($destKey === $finalKey) {
                $memo[$key] = ($key === $leftRoot) ? 'left' : (($key === $rightRoot) ? 'right' : null);
            } else {
                $parent = $byCoords->get($destKey);
                $memo[$key] = $parent ? $sideOf($parent) : null;
            }
            return $memo[$key];
        };

        foreach ($byCoords as $bracketGame) {
            $side = $sideOf($bracketGame);
            if ($bracketGame->side !== $side) {
                $bracketGame->side = $side;
                $bracketGame->save();
            }
        }
    }

    private function coordKey(?int $stageNum, ?int $groupNum): string
    {
        return $stageNum . ':' . $groupNum;
    }

    private function gameKey(string $subType, ?int $teamA, ?int $teamB): string
    {
        $pair = collect([$teamA, $teamB])->sort()->values();
        return $subType . '|' . $pair[0] . '-' . $pair[1];
    }
}
