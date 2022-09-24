<?php

namespace App\Http\Resources;

use App\Player;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Player $player */
        $player = $this->resource;

        return [
            "id"              => $player->id,
            "name"            => $player->name,
            "shirt"           => $player->shirt,
            "goals"           => $player->goals,
            "assists"         => $player->assists,
            "team_id"         => $player->team_id,
        ];
    }
}
