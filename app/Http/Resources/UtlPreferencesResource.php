<?php

namespace App\Http\Resources;

use App\TournamentUser;
use Illuminate\Http\Resources\Json\JsonResource;

class UtlPreferencesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var TournamentUser $utl */
        $utl = $this->resource;
        return [
            "auto_bet_strategy" => $utl->auto_bet_strategy,
        ];
    }
}
