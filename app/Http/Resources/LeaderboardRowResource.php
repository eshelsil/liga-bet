<?php

namespace App\Http\Resources;

use App\Leaderboard;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardRowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var Leaderboard $leaderboardRow */
        $leaderboardRow = $this->resource;


        return [
            "id"                   => $leaderboardRow->id,
            "user_tournament_id"   => $leaderboardRow->user_tournament_id,
            "rank"                 => $leaderboardRow->rank,
            "score"                => $leaderboardRow->score,
            "betScoreOverride"     => json_decode($leaderboardRow['bet_score_override'], true),
            "sideTournamentId"     => $leaderboardRow->side_tournament_id,
        ];
    }
}
