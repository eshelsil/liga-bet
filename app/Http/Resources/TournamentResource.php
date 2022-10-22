<?php

namespace App\Http\Resources;

use App\Tournament;
use App\TournamentUser;
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
            "competition_id"  => $t->competition_id,
            "created_at"      => $t->created_at,
            "status"          => $t->status,
            "config"          => $t->config,
            "creator_user_id" => $t->creator_user_id,
        ];
    }
}
