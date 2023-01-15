<?php

namespace App\Http\Resources;

use App\DataCrawler\Crawler;
use App\Player;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Player $player */
        $player = $this->resource;

        // TODO: Save in DB or make $player->competition->getCrawler()->getPlayerFlag()
        $imgUrl = "https://imagecache.365scores.com/image/upload/f_png,w_40,h_40,c_limit,q_auto:eco,dpr_2,d_Athletes:{$player->external_id}.png,r_max,c_thumb,g_face,z_0.65/Athletes/NationalTeam/{$player->external_id}";
        return [
            "id"              => $player->id,
            "name"            => $player->name,
            "externalId"      => $player->external_id,
            "shirt"           => $player->shirt,
            // "goals"           => $player->goals,
            // "assists"         => $player->assists,
            // Demo - remove:
            "goals"           => $player->goalsData->sum('goals'),
            "assists"         => $player->goalsData->sum('assists'),
            "team"            => $player->team_id,
            "img"             => $imgUrl,
        ];
    }
}
