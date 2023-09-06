<?php

namespace App\Http\Resources;

use App\Competition;
use Illuminate\Http\Resources\Json\JsonResource;

class CompetitionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Competition $competition */
        $competition = $this->resource;

        $startTime = $competition->getTournamentStartTime();

        $competition = $competition->toArray();
        $competition["startTime"] = $startTime;
        return $competition;
    }
}
