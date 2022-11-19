<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Enums\BetTypes;
use App\Leaderboard;
use App\LeaderboardsVersion;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use Illuminate\Support\Facades\DB;
use Log;

class UpdateLeaderboards
{
    public function handle(Competition $competition, int $gameId, string $versionDescription = "")
    {
        $competition->tournaments->each(
            fn (Tournament $tournament) => $this->updateRanks($tournament, $gameId, $versionDescription)
        );
    }

    public function updateRanks(Tournament $tournament, int $gameId, string $versionDescription)
    {
        if (config("test.onlyTournamentId") && config("test.onlyTournamentId") != $tournament->id) {
            return;
        }

        \Log::debug("[UpdateLeaderboards][handle] Started!!!");
        $betsScoreSum = $tournament->bets()
                     ->select(["user_tournament_id", DB::raw("COALESCE(sum(bets.score), 0) as total_score")])
                     ->groupBy(["user_tournament_id"])
                     ->orderBy("total_score", "desc")
                     ->get();

        $version = $tournament->leaderboardVersions->firstWhere('game_id', $gameId) ;
        if (!$version){
            $version = new LeaderboardsVersion();
            $version->tournament_id = $tournament->id;
            $version->description = $versionDescription || "game $gameId ended";
            $version->game_id = $gameId;
            $version->save();
        }

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

    public function handleNewScorersData(Competition $competition, $scorersByGameId)
    {
        $competition->tournaments->each(
            fn (Tournament $tournament) => $this->updateExistingVersions($tournament, $scorersByGameId)
        );
    }

    private function getGamesToConsider($version, $updatedGameIds, $gameIdsByLeaderboardVersionOrder){
        $versionIndex = $gameIdsByLeaderboardVersionOrder->search(fn($id) => $id == $version->id);
        $gamesToConsider = [];
        $updatedGameIds->each(function($id) use ($gameIdsByLeaderboardVersionOrder, $versionIndex){
            $index = $gameIdsByLeaderboardVersionOrder->search(fn($gameId) => $gameId == $id);
            if ($index <= $versionIndex) {
                $gamesToConsider[] = $id;
            }
        });
        return $gamesToConsider;
    }

    private function getScoresDiffByUtlId(
        LeaderboardsVersion $version,
        Tournament $tournament,
        $scorersByGameId,
        $utlsByTopScorerId,
        $utlsByTopAssitsId, 
        $updatedGameIds,
        $gameIdsByLeaderboardVersionOrder
    ){

        $eachGoal = array_get($tournament->config, "scores.specialBets.topScorer.eachGoal", 0);
        $eachAssist = array_get($tournament->config, "scores.specialBets.topAssists.eachGoal", 0);
        $scorersScoreDiffByPlayerId = [];
        $assistsScoreDiffByPlayerId = [];
        $gamesToConsider = $this->getGamesToConsider($version, $updatedGameIds, $gameIdsByLeaderboardVersionOrder);
        foreach($gamesToConsider as $gameId){
            $newScorersData = collect(data_get($scorersByGameId[$gameId], 'scorers', []))
                ->map(fn($goals)=> $goals * $eachGoal);
            $newAssistsData = collect(data_get($scorersByGameId[$gameId], 'assists', []))
                ->map(fn($goals)=> $goals * $eachAssist);
            array_merge($scorersScoreDiffByPlayerId, $newScorersData);
            array_merge($assistsScoreDiffByPlayerId, $newAssistsData);
        }

        $scoreDiffByUtlId = [];
        foreach ($scorersScoreDiffByPlayerId as $playerId => $scoreDiff) {
            foreach($utlsByTopScorerId[$playerId] as $utlId){
                if (!array_key_exists($utlId, $scoreDiffByUtlId)){
                    $scoreDiffByUtlId[$utlId] = 0;
                }
                $scoreDiffByUtlId[$utlId] += $scoreDiff;
            }
        }
        foreach ($utlsByTopAssitsId as $playerId => $scoreDiff) {
            foreach($utlsByTopScorerId[$playerId] as $utlId){
                if (!array_key_exists($utlId, $scoreDiffByUtlId)){
                    $scoreDiffByUtlId[$utlId] = 0;
                }
                $scoreDiffByUtlId[$utlId] += $scoreDiff;
            }
        }
        return $scoreDiffByUtlId;
    }
    

    public function updateExistingVersions(Tournament $tournament, $scorersByGameId)
    {
        if (config("test.onlyTournamentId") && config("test.onlyTournamentId") != $tournament->id) {
            return;
        }
        
        $updatedGameIds = $scorersByGameId->keys();
        $allVersions = $tournament->leaderboardVersions->sortBy('created_at');
        $existingVersions = $allVersions->whereIn('game_id', $updatedGameIds);
        $earliestVersion = $existingVersions->first();
        $versionsToUpdate = $earliestVersion ? $allVersions->slice($allVersions->search(fn($v) => $v->id = $earliestVersion->id)) : collect([]);
        $gameIdsByLeaderboardVersionOrder = $versionsToUpdate->pluck("game_id");

        $scorerSpecialBet = $tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        $utlsByTopScorerId = $tournament->bets
            ->where(['type' => BetTypes::SpecialBet, "type_id" => $scorerSpecialBet->id])
            ->groupBy(fn($bet) => $bet->getAnswer())
            ->map(fn($bet) => $bet->user_tournament_id);

        $assistsSpecialBet = $tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);
        $utlsByTopAssitsId = $tournament->bets
            ->where(['type' => BetTypes::SpecialBet, "type_id" => $assistsSpecialBet->id])
            ->groupBy(fn($bet) => $bet->getAnswer())
            ->map(fn($bet) => $bet->user_tournament_id);
        
    
        $versionsToUpdate->each(function($version) use (
            $tournament,
            $scorersByGameId,
            $utlsByTopScorerId,
            $utlsByTopAssitsId, 
            $updatedGameIds,
            $gameIdsByLeaderboardVersionOrder,
        ){
            $scoreDiffByUtlId = $this->getScoresDiffByUtlId(
                $version,
                $tournament,
                $scorersByGameId,
                $utlsByTopScorerId,
                $utlsByTopAssitsId, 
                $updatedGameIds,
                $gameIdsByLeaderboardVersionOrder
            );
            $this->updateVersionsByNewData($version, $scoreDiffByUtlId);
            
        });
    }

    public function updateVersionsByNewData(LeaderboardsVersion $version, $scoreDiffByUtlId)
    {
        foreach($scoreDiffByUtlId as $utlId => $scoreDiff){
            $leader = $version->leaderboards->firstWhere(fn($l) => $l->user_tournament_id == $utlId);
            $leader->score += $scoreDiff;
            Log::debug("Updated leaderboard-row score: added $scoreDiff points to utl $utlId on version $version->id");
            $leader->save();
        }
    }

}