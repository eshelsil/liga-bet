<?php

namespace App\Http\Resources;

use App\Group;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Group $group */
        $group = $this->resource;

        return [
            "id"        => $group->id,
            "name"      => $group->name,
            "isDone"    => true,
            "standings" => TeamResource::collection($group->teams),
        ];
    }
}
