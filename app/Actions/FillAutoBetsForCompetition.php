<?php

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Tournament;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FillAutoBetsForCompetition
{
    const STRATEGY_ZERO = 'zero';
    const STRATEGY_RANDOM = 'random';

    public function handle(Competition $competition): void
    {
        $competition->loadMissing(['tournaments.preferences', 'tournaments.utls']);

        $gamesToFill = $competition->games()
            ->whereNull('auto_bets_filled_at')
            ->whereNotNull('start_time')
            ->where('start_time', '<', time())
            ->get();

        foreach ($gamesToFill as $game) {
            try {
                Log::debug("[FillAutoBetsForCompetition] Starting to fill auto-bets for game {$game->id} in competition {$competition->id}");
                DB::transaction(function () use ($game, $competition) {
                    foreach ($competition->tournaments as $tournament) {
                        $this->fillForGameInTournament($game, $tournament);
                    }
                    $game->auto_bets_filled_at = Carbon::now();
                    $game->save();
                });
                Log::debug("[FillAutoBetsForCompetition] Finished filling auto-bets for game {$game->id} in competition {$competition->id}");
            } catch (\Throwable $e) {
                Log::error("[FillAutoBetsForCompetition] Failed for game {$game->id} in competition {$competition->id}: {$e->getMessage()}");
            }
        }
    }

    private function fillForGameInTournament(Game $game, Tournament $tournament): void
    {
        $isAutoBetOn = $tournament->preferences
            ? $tournament->preferences->isAutoBetOn()
            : false;
        if (!$isAutoBetOn) {
            return;
        }

        $qualifierBetIsOn = (bool) data_get($tournament->config, 'scores.gameBets.knockout.qualifier');

        $competingUtls = $tournament->competingUtls();

        if ($competingUtls->isEmpty()) {
            return;
        }

        $existingBetUtlIds = Bet::query()
            ->where('tournament_id', $tournament->id)
            ->where('type', BetTypes::Game)
            ->where('type_id', $game->id)
            ->pluck('user_tournament_id')
            ->flip();

        $missingUtls = $competingUtls->reject(fn($utl) => $existingBetUtlIds->has($utl->id));

        if ($missingUtls->isEmpty()) {
            return;
        }

        # TODO: manage 2-legs-tie games (for UCL)

        $nowDt = Carbon::now();
        $rows = [];
        foreach ($missingUtls as $utl) {
            $strategy = $utl->auto_bet_strategy ?? self::STRATEGY_ZERO;
            $data = $this->buildBetData($game, $strategy, $qualifierBetIsOn);

            $rows[] = [
                'type'               => BetTypes::Game,
                'type_id'            => $game->id,
                'user_tournament_id' => $utl->id,
                'tournament_id'      => $tournament->id,
                'data'               => $data,
                'score'              => null,
                'is_auto_bet'        => true,
                'created_at'         => $nowDt,
                'updated_at'         => $nowDt,
            ];
            Log::debug("[FillAutoBetsForCompetition] Prepared auto-bet for UTL {$utl->id} in tournament {$tournament->id} for game {$game->id}");
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            Bet::query()->insert($chunk);
            Log::info("[FillAutoBetsForCompetition] Inserted " . count($chunk) . " auto-bets for game {$game->id} in tournament {$tournament->id}.\n" . "utl_ids: " . implode(', ', array_column($chunk, 'user_tournament_id')));
        }
    }

    private function buildBetData(Game $game, string $strategy, bool $qualifierBetIsOn): string
    {
        if ($strategy === self::STRATEGY_RANDOM) {
            return $game->generateRandomBetData($qualifierBetIsOn);
        }

        $rec = [
            'result-home' => 0,
            'result-away' => 0,
        ];
        if ($game->isKnockout() && $qualifierBetIsOn) {
            $rec['ko_winner_side'] = Arr::random(['home', 'away']);
        }
        return json_encode($rec);
    }
}
