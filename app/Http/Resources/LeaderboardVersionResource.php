<?php

namespace App\Http\Resources;

use App\Leaderboard;
use App\LeaderboardsVersion;
use App\TournamentUser;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardVersionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var LeaderboardsVersion $version */
        $version = $this->resource;

        $leaderboards = static::calcScoreBoardRank($version->leaderboards->sortByDesc("score"));

        return [
            "id"              => $version->id,
            "description"     => $version->description,
            "created_at"      => $version->created_at,
            "leaderboard"     => $leaderboards
                ->map(fn (Leaderboard $l) => $l->only(["id", "user_tournament_id", "rank", "score"])),
        ];
    }

    public static function calcScoreBoardRank($scoreboardsDesc){
        $lastScore = null;
        $rank = null;
        return $scoreboardsDesc->map(function($leader, $i) use($rank, $lastScore) {
            if ($lastScore != $leader->score) {
                $rank = $i + 1;
            }
            $leader->rank = $rank;
            $lastScore = $leader->score;
        });
    }
}
