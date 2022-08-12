<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Leaderboard;
use App\LeaderboardsVersion;
use App\Ranks;
use App\Scorer;
use App\Team;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class UpdateLeaderboards
{
    public function handle(Competition $competition, string $versionDescription = "")
    {
        $competition->tournaments->each(
            fn (Tournament $tournament) => $this->updateRanks($tournament, $versionDescription)
        );
    }

    public function updateRanks(Tournament $tournament, string $versionDescription)
    {
        $betsScoreSum = $tournament->bets()
                     ->select(["user_tournament_id", DB::raw("COALESCE(sum(bets.score), 0) as total_score")])
                     ->where('permissions', '<>>', 0)
                     ->groupBy(["user_tournament_id"])
                     ->orderBy("total_score", "desc")
                     ->get();

        $version = new LeaderboardsVersion();
        $version->tournament_id = $tournament->id;
        $version->description = $versionDescription;
        $version->save();

        $lastScore = null;
        $rank = null;
        foreach ($betsScoreSum as $i => $userScore) {
            if ($lastScore != $userScore->total_score) {
                $rank = $i + 1;
            }

            $leader = new Leaderboard();
            $leader->tournament_id      = $tournament->id;
            $leader->user_tournament_id = $userScore->user_tournament_id;
            $leader->version_id         = $version->id;
            $leader->rank               = $rank;
            $leader->score = $lastScore = $userScore->total_score;
            $leader->save();
        }

        // TODO: Users with no bets at all?
    }

}