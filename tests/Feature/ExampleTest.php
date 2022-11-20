<?php

namespace Tests\Feature;

use App\Actions\CreateMonkeyUser;
use App\Actions\CreateTournament;
use App\Actions\UpdateCompetition;
use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\GameDataGoal;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Log;
use Tests\TestCase;

class ExampleTest extends TestCase
{

    protected CreateTournament $createTournament;
    protected CreateMonkeyUser $createMonkeyUser;
    protected UpdateCompetition $updateCompetition;
    protected Competition $competition;
    protected Tournament $tournament;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createTournament = app()->make(CreateTournament::class);
        $this->createMonkeyUser = app()->make(CreateMonkeyUser::class);
        $this->updateCompetition = app()->make(UpdateCompetition::class);
        $this->competition = Competition::query()->latest()->first();
        $this->competition->players()->update(["goals" => 0, "assists" => 0]);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateTournament()
    {
        $adminUser = $this->generateUser(User::TYPE_TOURNAMENT_ADMIN);

        $this->tournament = $this->createTournament->handle($adminUser, $this->competition, $this->faker->company);

        $this->assertTrue($this->tournament->exists);

        config()->set("test.onlyTournamentId", $this->tournament->id);

        $externalGames = $this->competition->getCrawler()->fetchGames();

        $game3ExtId = $externalGames->first(fn($g) =>
            $g->externalId != $externalGames[1]->externalId
            && in_array($externalGames[1]->teamAwayExternalId, [$g->teamHomeExternalId, $g->teamAwayExternalId])
        )->externalId;
        $game3Index = $externalGames->search(fn($g) => $g->externalId == $game3ExtId);
        $betsData = collect([
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [1,2]],
                    2 => ["guess" => [2,1]],
                    $game3Index => ["guess" => [0,0]],
                ],
                "scorer"  => $utl1Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[1]->teamAwayExternalId)->players->get(0),
                "assists" => $utl1Assist = $this->competition->teams->firstWhere("external_id", $externalGames[1]->teamAwayExternalId)->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,2]],
                    2 => ["guess" => [0,0]],
                    $game3Index => ["guess" => [1,0]],
                ],
                "scorer"  => $utl2Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamAwayExternalId)->players->get(0),
                "assists" => $utl2Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamAwayExternalId)->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,4]],
                    2 => ["guess" => [1,2]],
                    $game3Index => ["guess" => [0,1]],
                ],
                "scorer"  => $utl3Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamHomeExternalId)->players->get(0),
                "assists" => $utl3Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamHomeExternalId)->players->get(1),
            ],
        ]);
        $utlId1 = data_get($betsData[0], 'utl.id');
        $utlId2 = data_get($betsData[1], 'utl.id');
        $utlId3 = data_get($betsData[2], 'utl.id');
            Log::debug("utls:  ".$utlId1." ".$utlId2." ".$utlId3);
        $this->makePreBets($betsData);

        $this->assertEquals(62*3, $this->tournament->bets()->count());

        // Assert game 1
        $scorers = collect([
            new \App\DataCrawler\Player($utl1Scorer->external_id, "test", $utl1Scorer->team->external_id, goals: 2, assists: 1),
            new \App\DataCrawler\Player($utl1Assist->external_id, "test", $utl1Assist->team->external_id, goals: 1, assists: 2),
        ]);

        $this->assertGame($externalGames, 1, $betsData, 1, 2, $scorers, false, [
            "betsByUtlId" => [
                "$utlId1" => ["gameScore" => 6, "scorerScore" => 8, "assistsScore" => 6],
                "$utlId2" => ["gameScore" => 0, "scorerScore" => 0, "assistsScore" => 0],
                "$utlId3" => ["gameScore" => 2, "scorerScore" => 0, "assistsScore" => 0],
            ]
        ]);

        // Assert LIVE game 2
        $scorers = collect([
            new \App\DataCrawler\Player($utl2Scorer->external_id, "test", $utl2Scorer->team->external_id, goals: 1, assists: 0),
            new \App\DataCrawler\Player($utl2Assist->external_id, "test", $utl2Assist->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl3Scorer->external_id, "test", $utl3Scorer->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl3Assist->external_id, "test", $utl3Assist->team->external_id, goals: 0, assists: 1),
        ]);
        $this->assertGame($externalGames, 2, $betsData, 0, 1, $scorers, true, [
            "betsByUtlId" => [
                "$utlId1" => ["gameScore" => null, "scorerScore" => 8, "assistsScore" => 6],
                "$utlId2" => ["gameScore" => null, "scorerScore" => 0, "assistsScore" => 0],
                "$utlId3" => ["gameScore" => null, "scorerScore" => 0, "assistsScore" => 0],
            ],
            "isDone" => false,
            "goalsData" => [
                $utl3Assist->external_id => ["goals" => 0, "assists" => 1],
                $utl2Scorer->external_id => ["goals" => 1, "assists" => 0],
            ],
        ]);


        // Assert game 2
        $scorers = collect([
            new \App\DataCrawler\Player($utl2Scorer->external_id, "test", $utl2Scorer->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl2Assist->external_id, "test", $utl2Assist->team->external_id, goals: 0, assists: 1),
            new \App\DataCrawler\Player($utl3Scorer->external_id, "test", $utl3Scorer->team->external_id, goals: 3, assists: 0),
            new \App\DataCrawler\Player($utl3Assist->external_id, "test", $utl3Assist->team->external_id, goals: 1, assists: 1),
        ]);
        $this->assertGame($externalGames, 2, $betsData, 1, 1, $scorers, false, [
            "betsByUtlId" => [
                "$utlId1" => ["gameScore" => 0, "scorerScore" => 8, "assistsScore" => 6],
                "$utlId2" => ["gameScore" => 2, "scorerScore" => 0, "assistsScore" => 3],
                "$utlId3" => ["gameScore" => 0, "scorerScore" => 12, "assistsScore" => 3],
            ],
            "isDone" => true,
            "scoredboardAddedScore" => [
                "$utlId1" => 0,
                "$utlId2" => 5,
                "$utlId3" => 15,
            ],
        ]);


        
        //  Assert game 3
        $scorers = collect([
            new \App\DataCrawler\Player($utl1Scorer->external_id, "test", $utl1Scorer->team->external_id, goals: 3, assists: 1),
            new \App\DataCrawler\Player($utl1Assist->external_id, "test", $utl1Assist->team->external_id, goals: 2, assists: 3),
        ]);
        $this->assertGame($externalGames, $game3Index, $betsData, 1, 1, $scorers, false, [
            "betsByUtlId" => [
                "$utlId1" => ["gameScore" => 2, "scorerScore" => 12, "assistsScore" => 9],
                "$utlId2" => ["gameScore" => 0, "scorerScore" => 0, "assistsScore" => 3],
                "$utlId3" => ["gameScore" => 0, "scorerScore" => 12, "assistsScore" => 3],
            ]
        ]);


        // Assert game 2 - update scorers after game 3 is done
        $scorers = collect([
            new \App\DataCrawler\Player($utl2Scorer->external_id, "test", $utl2Scorer->team->external_id, goals: 2, assists: 0),
            new \App\DataCrawler\Player($utl2Assist->external_id, "test", $utl2Assist->team->external_id, goals: 1, assists: 0),
            new \App\DataCrawler\Player($utl3Scorer->external_id, "test", $utl3Scorer->team->external_id, goals: 2, assists: 0),
            new \App\DataCrawler\Player($utl3Assist->external_id, "test", $utl3Assist->team->external_id, goals: 1, assists: 2),
        ]);
        $this->assertGame($externalGames, 2, $betsData, 1, 1, $scorers, false, [
            "betsByUtlId" => [
                "$utlId1" => ["gameScore" => 0, "scorerScore" => 12, "assistsScore" => 9],
                "$utlId2" => ["gameScore" => 2, "scorerScore" => 8, "assistsScore" => 0],
                "$utlId3" => ["gameScore" => 0, "scorerScore" => 8, "assistsScore" => 6],
            ],
            "scoredboardTotalScore" => [
                "$utlId1" => 29,
                "$utlId2" => 10,
                "$utlId3" => 16,
            ],
        ]);

    }

    protected function makePreBets(\Illuminate\Support\Collection $betsData)
    {
        $scorerSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        foreach ($betsData as $betData) {
            /** @var TournamentUser $utl */
            $utl = $betData["utl"];
            $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $scorerSpecialBet->id);
            $bet->data = json_encode(['answer' => $betData["scorer"]->id]);
            $bet->save();
        }

        $assistsSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);
        foreach ($betsData as $betData) {
            /** @var TournamentUser $utl */
            $utl = $betData["utl"];
            $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $assistsSpecialBet->id);
            $bet->data = json_encode(['answer' => $betData["assists"]->id]);
            $bet->save();
        }
    }

    /**
     * @param array          $externalGame
     * @param TournamentUser $utl
     * @param int            $resultHome
     * @param int            $resultAway
     * @param string|null    $koWinner
     *
     * @return Bet
     */
    protected function updateUserGameBet(\App\DataCrawler\Game $externalGame, TournamentUser $utl, int $resultHome, int $resultAway, ?string $koWinner = null): Bet
    {
        /** @var Game $game */
        $game = $this->competition->games->firstWhere("external_id", $externalGame->externalId);

        /** @var Bet $bet */
        $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::Game && $bet->type_id == $game->id);
        $bet->data = json_encode(
            ['result-home' => $resultHome, 'result-away' => $resultAway] +
            ($koWinner ? ['ko_winner_side' => $koWinner] : [])
        );
        $bet->save();

        return $bet;
    }

    /**
     * @param Collection      $externalGames
     * @param int             $externalId
     * @param Collection      $betsData
     * @param int             $resultHome
     * @param int             $resultAway
     * @param Collection|null $scorers
     * @param bool            $isLive
     *
     * @return void
     */
    protected function assertGame(\Illuminate\Support\Collection $externalGames, int $externalId, \Illuminate\Support\Collection $betsData, int $resultHome, int $resultAway, ?\Illuminate\Support\Collection $scorers = null, bool $isLive = false, $validateData = []): void
    {
        /** @var \App\DataCrawler\Game $externalGame */
        $externalGame = $externalGames[$externalId];
        $externalGame->isDone               = !$isLive;
        $externalGame->isStarted            = true;
        $externalGame->resultHome           = $resultHome;
        $externalGame->resultAway           = $resultAway;
        
        /** @var Game $game */
        $game = $this->competition->games->firstWhere("external_id", $externalGame->externalId);
        $game->start_time            = Carbon::now()->subHours(1)->timestamp;
        $game->save();
        $tournamentId = $this->tournament->id;

        $scorerSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        $assistsSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);

        $initialLBVersionsCount = $this->tournament->leaderboardVersions->count();
        $initialRelatedLBVersion = $this->tournament->leaderboardVersions->first(fn($v) => $v->game_id == $game->id);


        $latestLBVersion = $this->tournament->leaderboardVersions->sortByDesc('id')->first();
        $initialScoreByUtlId = $latestLBVersion
            ? $latestLBVersion->leaderboards
                ->keyBy("user_tournament_id")
                ->map(fn($l) => $l->score)->toArray()
            : [];

        foreach ($betsData as  $i => $betData) {
            $utl = $betData["utl"];
            $this->updateUserGameBet(
                $externalGames[$externalId],
                $utl,
                $betData["games"][$externalId]["guess"][0],
                $betData["games"][$externalId]["guess"][1]
            );
        }


        $this->updateCompetition->fake(collect([$externalGames[$externalId]]), $scorers);

        $this->updateCompetition->handle($this->competition);


        $this->tournament->refresh();
        $currentLBVersionsCount = $this->tournament->leaderboardVersions->count();
        $latestLBVersion = $this->tournament->leaderboardVersions->sortByDesc('id')->first();
        $relatedLBVersion = $this->tournament->leaderboardVersions->first(fn($v) => $v->game_id == $game->id);
        if ($isLive){
            $this->assertEquals($initialLBVersionsCount, $currentLBVersionsCount);
        } else {
            $this->assertNotEmpty($relatedLBVersion);
            $this->assertEquals($currentLBVersionsCount, $initialLBVersionsCount + ($initialRelatedLBVersion ? 0 : 1) );
        }
        if ($relatedLBVersion){
            $leaderboards = $relatedLBVersion->leaderboards;
            $this->assertEquals($betsData->count(), $leaderboards->count());
            $expectAddedScore = data_get($validateData, "scoredboardAddedScore");
            if ($expectAddedScore){
                foreach($expectAddedScore as $utlId => $addedScore){
                    $currentScore = $leaderboards->first(fn($l) => $l->user_tournament_id == $utlId)->score - data_get($initialScoreByUtlId, $utlId, 0);
                    $this->assertEquals($addedScore, $currentScore);
                }
            }
            $expectFinalScore = data_get($validateData, "scoredboardTotalScore");
            if ($expectFinalScore){
                foreach($expectFinalScore as $utlId => $totalScore){
                    $currentScore = $latestLBVersion->leaderboards->first(fn($l) => $l->user_tournament_id == $utlId)->score;
                    $this->assertEquals($totalScore, $currentScore);
                }
            }
        }

        $expectGoalsData = data_get($validateData, "goalsData");
        if ($expectGoalsData){
            foreach($expectGoalsData as $playerExternalId => $expectedData){
                $goalsData = $this->tournament->competition->players->firstWhere('external_id', $playerExternalId)->goalsData->firstWhere('game_id', $game->id);
                $this->assertEquals($expectedData["goals"], $goalsData->goals);
                $this->assertEquals($expectedData["assists"], $goalsData->assists);
            }
        }

        foreach ($betsData as  $i => $betData) {
            $utl = $betData["utl"];
            $expectedGameScore = data_get($validateData, "betsByUtlId.$utl->id.gameScore");
            $expectedScorerScore = data_get($validateData, "betsByUtlId.$utl->id.scorerScore");
            $expectedAssitsScore = data_get($validateData, "betsByUtlId.$utl->id.assistsScore");
            $utl->unsetRelation('bets');
            if ($expectedGameScore){
                $gameBet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::Game && $bet->type_id == $game->id);
                $this->assertEquals($expectedGameScore, $gameBet->score, "Bet[{$externalId}][{$isLive}] 'game' of user (".($i+1).")");
            }
            if ($expectedScorerScore){
                $scorerBet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $scorerSpecialBet->id);
                $this->assertEquals($expectedScorerScore, $scorerBet->score, "Bet[{$externalId}][{$isLive}] 'goals' of user (".($i+1).")");
            }
            if ($expectedAssitsScore){
                $assistsBet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $assistsSpecialBet->id);
                $this->assertEquals($expectedAssitsScore, $assistsBet->score, "Bet[{$externalId}][{$isLive}] 'assists' of user (".($i+1).")");
            }
        }

        if (!is_null(data_get($validateData, "isDone", null))){
            $game->refresh();
            $this->assertEquals(data_get($validateData, "isDone"), $game->is_done);
        }
    }
}
