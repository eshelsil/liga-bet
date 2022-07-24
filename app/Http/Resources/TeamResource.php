<?php

namespace App\Http\Resources;

use App\Team;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Team $team */
        $team = $this->resource;

        return $team->only(["name", "id", "crest_url"]);
    }
}
