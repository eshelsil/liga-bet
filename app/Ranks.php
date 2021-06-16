<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class Ranks extends Model
{
    protected static $unguarded = true;

    protected $cachedData = null;

    public function getData($key = null)
    {
        if (is_null($this->cachedData)) {
            $this->cachedData = json_decode($this->data, false);
        }

        return data_get($this->cachedData, $key);
    }


    public static function updateRanks()
    {
        $table = User::query()
                     ->select(["users.id", "users.name", DB::raw("COALESCE(sum(bets.score), 0) as total_score")])
                     ->where(function (Builder $q) {
                         $q->where('permissions', '>', 0)
                           ->orWhere('permissions', -1);
                     })
                     ->join("bets", function (JoinClause $join) {
                         $join->on("users.id", "=", "user_id");
                     })
                     ->groupBy("users.id")
                     ->orderBy("total_score", "desc")
                     ->get();

        $lastRank = Ranks::query()->latest()->first();
        $lastRanksByUserId = collect($lastRank ? $lastRank->getData() : [])->keyBy("id");

        $rank = 0;
        $lastScore = -1;
        foreach ($table as $user) {
            if ($lastScore == $user->total_score) {
                $user->rankDisplay = "-";
            } else {
                $lastScore = $user->total_score;
                $rank++;
            }

            $user->rank = $rank;
            $user->rankDisplay = $user->rankDisplay ?? $rank;

            $user->change = $lastRanksByUserId->get($user->id) ? ($lastRanksByUserId->get($user->id)->rank - $rank) : 0;

            $user->betsByType = $user->bets->groupBy("type");
            if ($user->total_score === null){
                $user->total_score = 0;
            }
        }

        Ranks::query()->create([
            "data" => json_encode($table->toArray(), JSON_UNESCAPED_UNICODE),
        ]);
    }
}
