<?php

namespace App\Http\Resources;

use App\GameDataGoal;
use Illuminate\Http\Resources\Json\JsonResource;

class GameGoalsDataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var GameDataGoal $game */
        $goalsData = $this->resource;

        return [
            "id"              => $goalsData->id,
            "gameId"          => $goalsData->game_id,
            "playerId"        => $goalsData->player_id,
            "goals"           => $goalsData->goals,
            "assists"         => $goalsData->assists,
            "updated_at"      => $goalsData->updated_at,
            "created_at"      => $goalsData->created_at,
        ];
    }
}
