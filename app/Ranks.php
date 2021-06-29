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

        $lastUser = null;
        foreach ($table as $i => $user) {
            if ($user->total_score === null){
                $user->total_score = 0;
            }

            if ($lastUser && $lastUser->total_score == $user->total_score) {
                $user->rank = $lastUser->rank;
                $user->rankDisplay = "-";
            } else {
                $user->rank = $user->rankDisplay = $i+1;
            }

            $user->change = $lastRanksByUserId->get($user->id) ? ($lastRanksByUserId->get($user->id)->rank - $user->rank) : 0;
            $user->previousRank = $lastRanksByUserId->get($user->id) ? ($lastRanksByUserId->get($user->id)->rank) : "-";

            $user->addedScore = $lastRanksByUserId->get($user->id) ? ($user->total_score - $lastRanksByUserId->get($user->id)->total_score) : 0;


            unset($user->bets);
            $lastUser = $user;
        }

        Ranks::query()->create([
            "data" => json_encode($table->toArray(), JSON_UNESCAPED_UNICODE),
        ]);
    }
}
