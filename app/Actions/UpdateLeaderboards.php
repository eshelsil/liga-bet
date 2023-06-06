<?php

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Leaderboard;
use App\LeaderboardsVersion;
use App\Tournament;
use Illuminate\Support\Collection;
use Log;

class UpdateLeaderboards
{
    public function handle(Competition $competition, int $firstGameId)
    {
        $competition->tournaments->each(
            fn (Tournament $tournament) => $this->updateRanks($tournament, $firstGameId)
        );
    }

    public function updateRanks(Tournament $tournament, int $firstGameId)
    {
        if (config("test.onlyTournamentId") && config("test.onlyTournamentId") != $tournament->id) {
            return;
        }
        Log::debug("[UpdateLeaderboards][updateRanks] Started for tournament $tournament->id!!! will update all versions since game $firstGameId");
        $sortedGameIds = $tournament->competition->getSortedGameIds();
        $latestVersionGameId = null;
        $shouldUpdateVersions = false;
        foreach($sortedGameIds as $gameId){
            Log::debug("[UpdateLeaderboards][updateRanks] Going over game $gameId");
            if ($gameId == $firstGameId){
                $shouldUpdateVersions = true;
            }
            $game = Game::find($gameId);
            if ($game->is_done){
                if ($shouldUpdateVersions){
                    $this->updateVersion($tournament, $gameId, $latestVersionGameId);
                }
                $latestVersionGameId = $gameId;
            }
        }
    }

    public function updateVersion(Tournament $tournament, int $gameId, ?int $prevGameId)
    {
        $version = $tournament->leaderboardVersions()->firstWhere('game_id', $gameId);
        if (!$version){
            $version = new LeaderboardsVersion();
            $version->tournament_id = $tournament->id;
            $version->game_id = $gameId;
            $version->save();
        }

        if ($prevGameId){
            $prevVersion = $tournament->leaderboardVersions()->firstWhere('game_id', $prevGameId);
            $prevScoreboardRowByUtlId = $prevVersion->load('leaderboards')->leaderboards
                ->keyBy('user_tournament_id');
        } else {
            $prevScoreboardRowByUtlId = collect();
        }

        $betsScoreSum = $tournament->getBetsScorePerUtlForGame($gameId)
            ->map(function(Collection $betsWithGainedScore, int $utlId) use ($prevScoreboardRowByUtlId) {
                $currentScore = $betsWithGainedScore->sum('score');
                $utlPrevRow = $prevScoreboardRowByUtlId->get($utlId);
                $prevScore = $utlPrevRow ? $utlPrevRow->score : 0;
                $primalBetsById = $betsWithGainedScore->filter(fn(Bet $bet) => $bet->type != BetTypes::Game)->keyBy('id');
                return [
                    "score" => $currentScore + $prevScore,
                    "utlId" => $utlId,
                    "bet_score_override" => $primalBetsById->map(function(Bet $bet) use($utlPrevRow) {
                        $prevBetsScoreOverride = $utlPrevRow ? json_decode($utlPrevRow->bet_score_override, true) : [];
                        $prevBetScore = $prevBetsScoreOverride[$bet->id] ?? 0;
                        return $bet->score + $prevBetScore;
                    }),
                ];
            })->sortByDesc('score')->values();

        $lastScore = -1;
        $rank = null;
        foreach ($betsScoreSum as $i => $userScore) {
            $score = $userScore['score'];
            $utlId = $userScore['utlId'];
            $betScoreOverride = $userScore['bet_score_override'];
            if ($lastScore != $score) {
                $rank = $i + 1;
            }

            $leader = $version->leaderboards()->firstWhere('user_tournament_id', $utlId);
            if (!$leader){
                $leader = new Leaderboard();
                $leader->tournament_id      = $tournament->id;
                $leader->user_tournament_id = $utlId;
                $leader->version_id         = $version->id;
            }
            $leader->rank               = $rank;
            $leader->score = $lastScore = $score;
            $leader->bet_score_override = $betScoreOverride;
            $leader->save();
        }
    }

}