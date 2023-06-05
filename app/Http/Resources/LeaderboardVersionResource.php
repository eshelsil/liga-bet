<?php

namespace App\Http\Resources;

use App\Leaderboard;
use App\LeaderboardsVersion;
use App\TournamentUser;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardVersionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var LeaderboardsVersion $version */
        $version = $this->resource;
        return [
            "id"              => $version->id,
            "description"     => $version->description,
            "created_at"      => $version->created_at,
            "gameId"          => $version->game_id,
        ];
    }
}
