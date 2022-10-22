<?php

namespace App\Http\Resources;

use App\Tournament;
use Illuminate\Http\Resources\Json\JsonResource;

class TournamentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Tournament $t */
        $t = $this->resource;
        return [
            "id"              => $t->id,
            "name"            => $t->name,
            "competitionId"   => $t->competition_id,
            "status"          => $t->status,
            "config"          => $t->config,
            "creatorUserId"   => $t->creator_user_id,
            "code"            => $t->code,
            "createdAt"       => $t->created_at,
            "updatedAt"       => $t->updated_at,
        ];
    }
}
