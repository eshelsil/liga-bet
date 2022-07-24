<?php

namespace App\Http\Resources;

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

        return [
            "id"              => $game->id,
            "home_team"       => new TeamResource($game->teamHome),
            "away_team"       => new TeamResource($game->teamAway),
            "result_home"     => $game->result_home,
            "result_away"     => $game->result_away,
            "winner_side"     => $game->getKnockoutWinnerSide(),
            "is_done"         => $game->is_done,
            "closed_for_bets" => $game->start_time < time(),
            "start_time"      => Carbon::createFromTimestamp($game->start_time),
        ];
    }
}
