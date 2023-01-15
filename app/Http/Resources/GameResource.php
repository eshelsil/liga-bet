<?php

namespace App\Http\Resources;

use App\Enums\GameSubTypes;
use App\Game;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        $mockGames = [
            // 142 => [2,2,3,3,],
        ];
        /** @var Game $game */
        $game = $this->resource;

        $subType = $game->isGroupStage()
        ? $game->competition->groups->firstWhere('external_id', $game->sub_type)?->id
        : match ($game->sub_type) {
            GameSubTypes::FINAL          => "final",
            GameSubTypes::SEMI_FINALS    => "semiFinal",
            GameSubTypes::QUARTER_FINALS => "quarterFinal",
            GameSubTypes::LAST_16        => "last16",
            GameSubTypes::LAST_32        => "last32",
            default                      => null
        };

        return [
            "id"                => $game->id,
            "home_team"         => $game->team_home_id,
            "away_team"         => $game->team_away_id,

            // "result_home"       => $game->result_home,
            // "result_away"       => $game->result_away,
            // "full_result_home"  => $game->full_result_home,
            // "full_result_away"  => $game->full_result_away,
            
            // Demo remove :
            "result_home"       => array_key_exists($game->id, $mockGames) ? $mockGames[$game->id][0] : $game->result_home,
            "result_away"       => array_key_exists($game->id, $mockGames) ? $mockGames[$game->id][1] : $game->result_away,
            "full_result_home"  => array_key_exists($game->id, $mockGames) ? data_get($mockGames[$game->id], 2, null) : $game->full_result_home,
            "full_result_away"  => array_key_exists($game->id, $mockGames) ? data_get($mockGames[$game->id], 3, null) : $game->full_result_away,

            "winner_side"       => $game->getKnockoutWinnerSide(),
            "is_done"           => $game->is_done,

            // "closed_for_bets"   => $game->start_time < time(),

            // Demo remove :
            "closed_for_bets"   => $game->isClosedForBets(),

            "type"              => $game->type,
            "subType"           => $subType,
            "start_time"        => Carbon::createFromTimestamp($game->start_time),
        ];
    }
}
