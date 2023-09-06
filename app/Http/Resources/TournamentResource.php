<?php

namespace App\Http\Resources;

use App\Tournament;
use App\User;
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
        $res = [
            "id"              => $t->id,
            "name"            => $t->name,
            "competitionId"   => $t->competition_id,
            "competition"     => new CompetitionResource($t->competition),
            "status"          => $t->status,
            "config"          => $t->config,
            "creatorUserId"   => $t->creator_user_id,
            "code"            => $t->code,
            "createdAt"       => $t->created_at,
            "updatedAt"       => $t->updated_at,
        ];

        /** @var User $user */
        $user = $request->user();
        if ($user->id == $t->creator_user_id){
            $res['preferences'] = $t->preferences;
        }

        return $res;
    }
}
