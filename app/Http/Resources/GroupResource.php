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

        $standings = null;
        if ($group->standings) {
            $teams = $group->teams->keyBy("id");
            $teamsSortedByStandings = collect(json_decode($group->standings, true))
                ->map(fn($teamId) => $teams->get($teamId));
            $standings = TeamResource::collection($teamsSortedByStandings);
        }

        return [
            "id"        => $group->id,
            "name"      => $group->name,
            "isDone"    => !!$standings,
            "standings" => $standings,
        ];
    }
}
