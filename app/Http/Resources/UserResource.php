<?php

namespace App\Http\Resources;

use App\User;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var User $ser */
        $user = $this->resource;
        return [
            "id"                     => $user->id,
            "name"                   => $user->name,
            "username"               => $user->username,
            "permissions"            => $user->permissions,
            "canUpdateScoreConfig"   => $user->can_edit_score_config,
            "createdAt"              => $user->created_at,
            "updatedAt"              => $user->updated_at,
        ];
    }
}
