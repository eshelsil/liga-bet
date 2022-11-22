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
use Illuminate\Database\Eloquent\Relations\HasMany;
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

        $version = $tournament->leaderboardVersions->firstWhere('game_id', $gameId);
        if ($version) return;

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
        $version->refresh();

        // TODO: Users with no bets at all?
    }

    public function handleNewScorersData(Competition $competition, $scorersByGameId)
    {
        $competition->tournaments->each(
            fn (Tournament $tournament) => $this->updateExistingVersions($tournament, $scorersByGameId)
        );
    }

    private function getGamesToConsider($version, $updatedGameIds, $gameIdsByLeaderboardVersionOrder){
        $versionIndex = $gameIdsByLeaderboardVersionOrder->search(fn($id) => $id == $version->game_id);
        return $updatedGameIds->filter(function($id) use ($gameIdsByLeaderboardVersionOrder, $versionIndex){
            $index = $gameIdsByLeaderboardVersionOrder->search(fn($gameId) => $gameId == $id);
            return $index <= $versionIndex;
        });
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
        Log::debug(['$utlsByTopScorerId' => $utlsByTopScorerId->toJson(), '$utlsByTopAssitsId' =>$utlsByTopAssitsId->toJson()]);

        $eachGoal = array_get($tournament->config, "scores.specialBets.topScorer.eachGoal", 0);
        $eachAssist = array_get($tournament->config, "scores.specialBets.topAssists.eachGoal", 0);
        $scorersScoreDiffByPlayerId = collect([]);
        $assistsScoreDiffByPlayerId = collect([]);
        $gamesToConsider = $this->getGamesToConsider($version, $updatedGameIds, $gameIdsByLeaderboardVersionOrder);
        foreach($gamesToConsider as $gameId){
            $newScorersData = collect(data_get($scorersByGameId[$gameId], 'scorers', []))
                ->map(fn($goals)=> $goals * $eachGoal);
            $newAssistsData = collect(data_get($scorersByGameId[$gameId], 'assists', []))
            ->map(fn($goals)=> $goals * $eachAssist);
            $scorersScoreDiffByPlayerId = $newScorersData->union($scorersScoreDiffByPlayerId);
            $assistsScoreDiffByPlayerId = $newAssistsData->union($assistsScoreDiffByPlayerId);
        }

        $scoreDiffByUtlId = collect([]);
        foreach (($scorersScoreDiffByPlayerId ?? []) as $playerId => $scoreDiff) {
            foreach(collect($utlsByTopScorerId)->get($playerId, []) as $utlId){
                if (!$scoreDiffByUtlId->has($utlId)){
                    $scoreDiffByUtlId[$utlId] = 0;
                }
                $scoreDiffByUtlId[$utlId] += $scoreDiff;
            }
        }
        foreach (($assistsScoreDiffByPlayerId ?? []) as $playerId => $scoreDiff) {
            foreach(collect($utlsByTopAssitsId)->get($playerId, []) as $utlId){
                if (!$scoreDiffByUtlId->has($utlId)){
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
        $tournament->refresh();
        $allVersions = $tournament->leaderboardVersions->sortBy('id');
        $earliestVersion = $allVersions->first(fn($version) => $updatedGameIds->contains($version->game_id));
        if (!$earliestVersion){
            return;
        }
        $versionsToUpdate = $allVersions->slice($allVersions->search(fn($v) => $v->id = $earliestVersion->id));
        $gameIdsByLeaderboardVersionOrder = $versionsToUpdate->pluck("game_id");

        $scorerSpecialBet = $tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        $assistsSpecialBet = $tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);
        $topScorerAndAssistsBets = $tournament
            ->load([
                "bets" => function (HasMany $query) use ($scorerSpecialBet, $assistsSpecialBet) {
                    $query->where(function($q) use ($scorerSpecialBet, $assistsSpecialBet) {
                        $q->where(['type' => BetTypes::SpecialBet, "type_id" => $scorerSpecialBet->id])
                            ->orWhere(['type' => BetTypes::SpecialBet, "type_id" => $assistsSpecialBet->id]);
                    });
                }
            ])->bets;
        $utlsByTopScorerId = $topScorerAndAssistsBets
            ->where("type_id", $scorerSpecialBet->id)
            ->groupBy(fn($bet) => $bet->getAnswer())
            ->map(fn($bets) => $bets->map(fn($bet) => $bet->user_tournament_id));

        $utlsByTopAssitsId = $tournament->bets
            ->where("type_id", $assistsSpecialBet->id)
            ->groupBy(fn($bet) => $bet->getAnswer())
            ->map(fn($bets) => $bets->map(fn($bet) => $bet->user_tournament_id));
        
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
        $hasChanges = false;
        $scoreboardRows = $version->leaderboards;
        $scoreboardWithNewScores = collect([]);
        foreach($scoreDiffByUtlId as $utlId => $scoreDiff){
            if ($scoreDiff != 0){
                $hasChanges = true;
            }
            $leader = $scoreboardRows->first(fn($l) => $l->user_tournament_id == $utlId);
            $leader->score += $scoreDiff;
            $scoreboardWithNewScores[] = $leader;
        }
        if ($hasChanges){
            $lastScore = null;
            $rank = null;
            foreach ($scoreboardRows->sortByDesc('score')->values() as $i => $leader) {
                if (is_null($rank)){
                    $rank = 1;
                } else if ($lastScore != $leader->score) {
                    $rank = $i + 1;
                }
                $leader->rank = $rank;
                $lastScore = $leader->score;
                $leader->save();
                Log::debug("Updated ScoreboardRow data [utl:$leader->user_tournament_id | version:$version->id] (newScore:$leader->score, newRank: $leader->rank)");
            }
        }
    }

}