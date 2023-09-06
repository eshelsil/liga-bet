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
        $imgUrl = "https://imagecache.365scores.com/image/upload/f_png,w_100,h_100,c_limit,q_auto:eco,dpr_2,d_Athletes:{$player->external_id}.png,r_max,c_thumb,g_face,z_0.65/Athletes/NationalTeam/{$player->external_id}";
        $isClubPlayer = $player->team->competition->isClubsCompetition();
        if ($isClubPlayer){
            $imgUrl = "https://imagecache.365scores.com/image/upload/f_png,w_100,h_100,c_limit,q_auto:eco,dpr_2,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/v27/Athletes/{$player->external_id}";
        }
        return [
            "id"              => $player->id,
            "name"            => $player->name,
            "externalId"      => $player->external_id,
            "shirt"           => $player->shirt,
            "goals"           => $player->goals,
            "assists"         => $player->assists,
            "team"            => $player->team_id,
            "img"             => $imgUrl,
        ];
    }
}
