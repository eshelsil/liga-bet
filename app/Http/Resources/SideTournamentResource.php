<?php

namespace App\Http\Resources;

use App\SideTournament;
use Illuminate\Http\Resources\Json\JsonResource;

class SideTournamentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var SideTournament $t */
        $st = $this->resource;
        $gameIds = $st->tournament->getSideTournamentGames()->filter(fn($stId) => $stId == $st->id)->keys();
        $res = [
            "id"                => $st->id,
            "tournament_id"     => $st->tournament_id,
            "name"              => $st->name,
            "emblem"            => $st->emblem,
            "gameIds"           => $gameIds,
            "createdAt"         => $st->created_at,
            "updatedAt"         => $st->updated_at,
        ];

        return $res;
    }
}
