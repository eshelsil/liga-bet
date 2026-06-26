<?php

namespace App\Http\Resources;

use App\BracketGame;
use App\BracketSlot;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A single knockout tie, as served to the frontend (contract D — structure part).
 *
 * Two consumers:
 *  - the Winner/Runner-Up bracket selector reads the slot objects (`home_slot`/`away_slot`), which
 *    carry the resolved team OR a source token ("1E", "3·ABCDF") for unsettled first-round slots;
 *  - the per-game qualifier bet views read the flat team/result fields (`home_team`, `bettable`,
 *    `user_qualifier_side`, `actual_qualifier_side`, …).
 *
 * Structural fields come from the feed bracket model (contract H): `round` = BracketGame.sub_type,
 * `side` = BracketGame.side, slot source = BracketSlot.{kind,origin_position,group,allowed_groups}.
 */
class BracketGameResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var BracketGame $bg */
        $bg = $this->resource;

        $game = $bg->game;
        $isDone = (bool) ($game?->is_done);

        $homeSlot = $this->slotPayload($bg->homeSlot(), $request);
        $awaySlot = $this->slotPayload($bg->awaySlot(), $request);

        return [
            "id"                    => $game?->id,        // playable game id (null until the tie is scheduled)
            "bracket_game_id"       => $bg->id,           // stable node id for the tree, present pre-draw
            "round"                 => $bg->sub_type,     // GameSubTypes
            "side"                  => $bg->side,         // "left" | "right" | null (contract C)
            "match_label"           => $bg->match_label,
            "start_time"            => $bg->start_time,

            // W/RU bracket selector (slot objects with team-or-token + click metadata)
            "home_slot"             => $homeSlot,
            "away_slot"             => $awaySlot,

            // Per-game qualifier bet views (flat fields)
            "home_team"             => $homeSlot["team"], // null = slot not filled yet
            "away_team"             => $awaySlot["team"],
            "bettable"              => $homeSlot["team"] !== null && $awaySlot["team"] !== null && !$isDone,
            "locked"                => false,             // Task 3
            "user_qualifier_side"   => null,              // Task 3
            "actual_qualifier_side" => $isDone ? $game->getKnockoutWinnerSide() : null,
            "is_done"               => $isDone,
        ];
    }

    private function slotPayload(?BracketSlot $slot, $request): array
    {
        $team = null;
        if ($slot && $slot->team) {
            $t = (new TeamResource($slot->team))->toArray($request);
            $team = [
                "id"        => $t["id"],
                "name"      => $t["name"],
                "crest_url" => $t["crest_url"],
            ];
        }
        return [
            "team"           => $team,                                  // null = slot not filled yet
            "label"          => $team ? null : $this->slotLabel($slot), // token shown when no team yet
            "is_third_place" => $this->isThirdPlaceSlot($slot),
            "group_id"       => $slot?->group_id,                       // concrete group → click opens its standings
            "group_name"     => $slot?->group?->name,                   // "Group B" (null for 3rd-place / unknown group)
            "position"       => $slot?->origin_position,                // group-stage rank: 1st / 2nd / 3rd
        ];
    }

    /** A first-round source token, or null for later-round (match-winner) slots — those are blank boxes. */
    private function slotLabel(?BracketSlot $slot): ?string
    {
        if (!$slot || $slot->kind !== BracketSlot::KIND_GROUP_POSITION) {
            return null;
        }
        $position = $slot->origin_position;
        if ($position && $slot->group) {
            return $position . $slot->group->name;          // "1E"
        }
        if ($position && $slot->allowed_groups) {
            return $position . "·" . $slot->allowed_groups; // "3·ABCDF"
        }
        return $slot->symbolic_name;
    }

    private function isThirdPlaceSlot(?BracketSlot $slot): bool
    {
        if (!$slot) {
            return false;
        }
        return $slot->allowed_groups !== null || $slot->symbolic_name === '3RD';
    }
}
