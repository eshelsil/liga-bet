<?php

namespace App\Http\Resources;

use App\DataCrawler\Crawler;
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

        $teamId365 = Crawler::translate365TeamId($team->external_id);

        $team = $team->only(["name", "id", "crest_url"]);
        $team["crest_url"] = "https://imagecache.365scores.com/image/upload/f_png,w_82,h_82,c_limit,q_auto:eco,dpr_2,d_Competitors:default1.png/v1/Competitors/{$teamId365}";

        return $team;
    }
}
