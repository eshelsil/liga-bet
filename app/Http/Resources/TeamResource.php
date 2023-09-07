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

        $name = $team->name;
        $crest_url = $team->crest_url;
        if ($team->competition->isSupports365TeamExtId()){
            $teamId365 = Crawler::translate365TeamId($team->external_id);
            $name = static::getHebNameFrom365($teamId365) ?? $team->name;
            $crest_url = "https://imagecache.365scores.com/image/upload/f_png,w_82,h_82,c_limit,q_auto:eco,dpr_2,d_Competitors:default1.png/v1/Competitors/{$teamId365}";
        }
        $isClub = $team->competition->isClubsCompetition();

        $team = $team->only(["name", "id", "crest_url", "group_id"]);
        $team["crest_url"] = $crest_url ;
        $team["is_club"] = $isClub;
        $team["name"] = $name;
        return $team;
    }

    public static function getHebNameFrom365($teamIdOn365)
    {
        return match ((int)$teamIdOn365) {
            104 => "ארסנל",
            105 => "מנצ'סטר יונייטד",
            110 => "מנצ'סטר סיטי",
            116 => "ניוקאסל יונייטד",
            131 => "ריאל מדריד",
            132 => "ברצלונה",
            134 => "אתלטיקו מדריד",
            135 => "סביליה",
            154 => "ריאל סוסיאדד",
            224 => "אינטר",
            227 => "מילאן",
            234 => "נאפולי",
            236 => "לאציו",
            331 => "באיירן מינכן",
            341 => "בורוסיה דורטמונד",
            392 => "אוניון ברלין",
            480 => "פסז'",
            481 => "לאנס",
            691 => "פיינורד",
            725 => "פ.ס.ו איינדהובן",
            754 => "סלטיק",
            887 => "פורטו",
            888 => "בנפיקה ליסבון",
            895 => "בראגה",
            945 => "גלאטסראיי",
            1139 => "יאנג בויז",
            1191 => "רויאל אנטוורפן",
            1739 => "זלצבורג",
            1824 => "פ.צ. קופנהגן",
            1955 => "שחטאר דונייצק",
            7171 => "לייפציג",
            8957 => "הכוכב האדום בלגרד",
            default => null,
        };
    }
}
