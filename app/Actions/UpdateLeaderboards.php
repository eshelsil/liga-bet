<?php

namespace App\Actions;

use App\Competition;
use App\Game;
use App\Leaderboard;
use App\LeaderboardsVersion;
use App\Tournament;
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
            $version->description = '';
            $version->save();
        }

        if ($prevGameId){
            $prevVersion = $tournament->leaderboardVersions()->with('leaderboards')->firstWhere('game_id', $prevGameId);
            $prevScoreByUtlId = $prevVersion->leaderboards
                ->keyBy('user_tournament_id')
                ->map(fn(Leaderboard $l) => $l->score);
        } else {
            $prevScoreByUtlId = $tournament->competingUtls()->keyBy('id')->map(fn($utl) => 0);
        }

        $betsScoreSum = $tournament->getGameScorePerUtl($gameId)
            ->map(fn(int $score, int $utlId) => [
                "score" => $score + ($prevScoreByUtlId->get($utlId) ?? 0),
                "utlId" => $utlId,
            ])->sortByDesc('score')->values();

        $lastScore = -1;
        $rank = null;
        foreach ($betsScoreSum as $i => $userScore) {
            $score = $userScore['score'];
            $utlId = $userScore['utlId'];
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
            $leader->save();
        }
    }

}