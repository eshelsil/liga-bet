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
        /** @var Game $game */
        $game = $this->resource;

        $subType = $game->isGroupStage()
        ? $game->competition->groups->firstWhere('external_id', $game->sub_type)?->id
        : match ($game->sub_type) {
            GameSubTypes::FINAL          => "final",
            GameSubTypes::THIRD_PLACE    => "thirdPlace",
            GameSubTypes::SEMI_FINALS    => "semiFinal",
            GameSubTypes::QUARTER_FINALS => "quarterFinal",
            GameSubTypes::LAST_16        => "last16",
            GameSubTypes::LAST_32        => "last32",
            default                      => null
        };

        $agg_results = $game->getAggResults();

        return [
            "id"                => $game->id,
            "home_team"         => $game->team_home_id,
            "away_team"         => $game->team_away_id,
            "result_home"       => $game->result_home,
            "result_away"       => $game->result_away,
            "full_result_home"  => $game->full_result_home,
            "full_result_away"  => $game->full_result_away,
            "agg_result_home"   => $agg_results ? $agg_results["home"] : null,
            "agg_result_away"   => $agg_results ? $agg_results["away"] : null,
            "winner_side"       => $game->getKnockoutWinnerSide(),
            "is_done"           => $game->is_done,
            "closed_for_bets"   => $game->start_time < time(),
            "type"              => $game->type,
            "subType"           => $subType,
            "isTwoLeggedTie"    => $game->isTwoLeggedTie(),
            "isFirstLeg"        => $game->isFirstLeg(),
            "isLastLeg"         => $game->isLastLeg(),
            "start_time"        => Carbon::createFromTimestamp($game->start_time),
            "end_time"          => Carbon::createFromTimestamp($game->done_time),
        ];
    }
}
