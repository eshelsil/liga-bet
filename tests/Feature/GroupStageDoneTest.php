<?php

namespace Tests\Feature;

use App\Actions\CreateMonkeyUser;
use App\Actions\CreateTournament;
use App\Actions\UpdateCompetition;
use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\DataCrawler\Game as CrawlerGame;
use App\GameDataGoal;
use App\Leaderboard;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Log;
use Tests\TestCase;

class GroupStageDoneTest extends TestCase
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
        
        $this->competition = Competition::query()->first();
        // TODO - create 1 test-competition & use it

        $this->competition->players()->update(["goals" => 0, "assists" => 0]);
        $this->competition->groups()->update(["standings" => null]);
        $this->competition->games()->update(["is_done" => false]);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUpdateGroupRanks()
    {
        $adminUser = $this->generateUser(User::TYPE_TOURNAMENT_ADMIN);

        $this->tournament = $this->createTournament->handle($adminUser, $this->competition, $this->faker->company);

        $this->assertTrue($this->tournament->exists);

        config()->set("test.onlyTournamentId", $this->tournament->id);

        $externalGames = $this->competition->getCrawler()->fetchGames();
        $externalTeams = $this->competition->getCrawler()->fetchTeams();
        $teamExtIdToId  = $this->tournament->competition->teams->pluck("id", "external_id");

        $groupATeams = $externalTeams->filter(fn($t) => $t["group_id"] == "GROUP_A")->values();
        $groupBTeams = $externalTeams->filter(fn($t) => $t["group_id"] == "GROUP_B")->values();
        $TeamA1ExtId = $groupATeams[0]["id"];
        $TeamA2ExtId = $groupATeams[1]["id"];
        $TeamA3ExtId = $groupATeams[2]["id"];
        $TeamA4ExtId = $groupATeams[3]["id"];
        $TeamB1ExtId = $groupBTeams[0]["id"];
        $TeamB2ExtId = $groupBTeams[1]["id"];
        $TeamB3ExtId = $groupBTeams[2]["id"];
        $TeamB4ExtId = $groupBTeams[3]["id"];

        $TeamA1Id = $teamExtIdToId[$TeamA1ExtId];
        $TeamA2Id = $teamExtIdToId[$TeamA2ExtId];
        $TeamA3Id = $teamExtIdToId[$TeamA3ExtId];
        $TeamA4Id = $teamExtIdToId[$TeamA4ExtId];
        $TeamB1Id = $teamExtIdToId[$TeamB1ExtId];
        $TeamB2Id = $teamExtIdToId[$TeamB2ExtId];
        $TeamB3Id = $teamExtIdToId[$TeamB3ExtId];
        $TeamB4Id = $teamExtIdToId[$TeamB4ExtId];

        $gameA1 = $this->generateGameData($externalGames, [$TeamA1ExtId => 3, $TeamA2ExtId => 0]);
        $gameA2 = $this->generateGameData($externalGames, [$TeamA3ExtId => 0, $TeamA4ExtId => 0]);
        $gameA3 = $this->generateGameData($externalGames, [$TeamA1ExtId => 1, $TeamA3ExtId => 2]);
        $gameA4 = $this->generateGameData($externalGames, [$TeamA2ExtId => 1, $TeamA4ExtId => 2]);
        $gameA5 = $this->generateGameData($externalGames, [$TeamA1ExtId => 4, $TeamA4ExtId => 0]);
        $gameA6 = $this->generateGameData($externalGames, [$TeamA2ExtId => 1, $TeamA3ExtId => 2]);
        $gameB1 = $this->generateGameData($externalGames, [$TeamB1ExtId => 3, $TeamB2ExtId => 0]);
        $gameB2 = $this->generateGameData($externalGames, [$TeamB3ExtId => 9, $TeamB4ExtId => 0]);
        $gameB3 = $this->generateGameData($externalGames, [$TeamB1ExtId => 1, $TeamB3ExtId => 2]);
        $gameB4 = $this->generateGameData($externalGames, [$TeamB2ExtId => 1, $TeamB4ExtId => 2]);
        $gameB5 = $this->generateGameData($externalGames, [$TeamB1ExtId => 4, $TeamB4ExtId => 0]);
        $gameB6 = $this->generateGameData($externalGames, [$TeamB2ExtId => 1, $TeamB3ExtId => 2]);

        $gameA1ExtId = $gameA1["externalId"];

        $betsData = collect([
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    "$gameA1ExtId" => [0, 0],
                ],
                "standings" => [
                    "GROUP_A" => [$TeamA1Id, $TeamA2Id, $TeamA3Id, $TeamA4Id],
                    "GROUP_B" => [$TeamB1Id, $TeamB2Id, $TeamB3Id, $TeamB4Id],
                ],
                "offensiveTeam"  => $TeamB1Id,
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    "$gameA1ExtId" => [0, 0],
                ],
                "standings" => [
                    "GROUP_A" => [$TeamA2Id, $TeamA1Id, $TeamA3Id, $TeamA4Id],
                    "GROUP_B" => [$TeamB2Id, $TeamB1Id, $TeamB3Id, $TeamB4Id],
                ],
                "offensiveTeam"  => $TeamA1Id,
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    "$gameA1ExtId" => [0, 0],
                ],
                "standings" => [
                    "GROUP_A" => [$TeamA4Id, $TeamA3Id, $TeamA2Id, $TeamA1Id],
                    "GROUP_B" => [$TeamB4Id, $TeamB3Id, $TeamB2Id, $TeamB1Id],
                ],
                "offensiveTeam"  => $TeamB3Id,
            ],
        ]);
        $utlId1 = data_get($betsData[0], 'utl.id');
        $utlId2 = data_get($betsData[1], 'utl.id');
        $utlId3 = data_get($betsData[2], 'utl.id');
            Log::debug("utls:  ".$utlId1." ".$utlId2." ".$utlId3);
        $this->updateBets($betsData);

        

        // Assert no done groups
        $standings = collect([]);
        $gamesData = collect([
            $gameA1, $gameA2, $gameA3, $gameA4, $gameA5,
            $gameB1, $gameB2, $gameB3, $gameB4,
        ]);
        $this->assertGroupStandings($externalGames, $gamesData, $standings, [
            "scoreByUtlId" => [
                "$utlId1" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => 0,
                ],
                "$utlId2" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => 0,
                ],
                "$utlId3" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => 0,
                ],
            ],
            "targetVersionRanks" => [
                "$utlId1" => 1,
                "$utlId2" => 1,
                "$utlId3" => 1,
            ],
            "scoredboardTotalScore" => [
                "$utlId1" => 0,
                "$utlId2" => 0,
                "$utlId3" => 0,
            ],
        ]);

        // Assert done first group
        $standings = collect([
            "GROUP_A" => $this->generateStandingsData([$TeamA2ExtId, $TeamA1ExtId, $TeamA3ExtId, $TeamA4ExtId]),
        ]);
        $gamesData = collect([
            $gameA6,
        ]);
        $this->assertGroupStandings($externalGames, $gamesData, $standings, [
            "scoreByUtlId" => [
                "$utlId1" => [
                    "groups" => [
                        "GROUP_A" => 6,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId2" => [
                    "groups" => [
                        "GROUP_A" => 12,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId3" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
            ],
            "targetVersionRanks" => [
                "$utlId1" => 2,
                "$utlId2" => 1,
                "$utlId3" => 3,
            ],
            "scoredboardTotalScore" => [
                "$utlId1" => 6,
                "$utlId2" => 12,
                "$utlId3" => 0,
            ],
            "scoredboardAddedScore" => [
                "$utlId1" => 6,
                "$utlId2" => 12,
                "$utlId3" => 0,
            ],
        ]);

        // Assert no new done group
        $standings = collect([
            "GROUP_A" => $this->generateStandingsData([$TeamA2ExtId, $TeamA1ExtId, $TeamA3ExtId, $TeamA4ExtId]),
        ]);
        $gamesData = collect([
            $gameB5,
        ]);
        $this->assertGroupStandings($externalGames, $gamesData, $standings, [
            "scoreByUtlId" => [
                "$utlId1" => [
                    "groups" => [
                        "GROUP_A" => 6,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId2" => [
                    "groups" => [
                        "GROUP_A" => 12,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId3" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
            ],
            "targetVersionRanks" => [
                "$utlId1" => 2,
                "$utlId2" => 1,
                "$utlId3" => 3,
            ],
            "scoredboardTotalScore" => [
                "$utlId1" => 6,
                "$utlId2" => 12,
                "$utlId3" => 0,
            ],
            "scoredboardAddedScore" => [
                "$utlId1" => 0,
                "$utlId2" => 0,
                "$utlId3" => 0,
            ],
        ]);

        // Assert new done group
        $standings = collect([
            "GROUP_A" => $this->generateStandingsData([$TeamA2ExtId, $TeamA1ExtId, $TeamA3ExtId, $TeamA4ExtId]),
            "GROUP_B" => $this->generateStandingsData([$TeamB2ExtId, $TeamB1ExtId, $TeamB4ExtId, $TeamB3ExtId]),
        ]);
        $gamesData = collect([
            $gameB6,
        ]);
        $this->assertGroupStandings($externalGames, $gamesData, $standings, [
            "scoreByUtlId" => [
                "$utlId1" => [
                    "groups" => [
                        "GROUP_A" => 6,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId2" => [
                    "groups" => [
                        "GROUP_A" => 12,
                        "GROUP_B" => 6,
                    ],
                    "offensiveTeam" => null,
                ],
                "$utlId3" => [
                    "groups" => [
                        "GROUP_A" => 0,
                        "GROUP_B" => 0,
                    ],
                    "offensiveTeam" => null,
                ],
            ],
            "targetVersionRanks" => [
                "$utlId1" => 2,
                "$utlId2" => 1,
                "$utlId3" => 3,
            ],
            "scoredboardTotalScore" => [
                "$utlId1" => 6,
                "$utlId2" => 18,
                "$utlId3" => 0,
            ],
            "scoredboardAddedScore" => [
                "$utlId1" => 0,
                "$utlId2" => 6,
                "$utlId3" => 0,
            ],
        ]);



    }

    protected function updateBets(\Illuminate\Support\Collection $betsData)
    {
        $offensiveTeamSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_OFFENSIVE_TEAM);
        foreach ($betsData as $betData) {
            /** @var TournamentUser $utl */
            $utl = $betData["utl"];
            $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $offensiveTeamSpecialBet->id);
            $bet->data = json_encode(['answer' => $betData["offensiveTeam"]]);
            $bet->save();

            $betOnGameIds = collect([]);
            $betOnGroupIds = collect([]);

            collect($betData['standings'])->each(function($standings, $groupExtId) use ($utl, $betOnGroupIds) {
                $group = $this->tournament->competition->groups->firstWhere("external_id", $groupExtId);
                $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::GroupsRank && $bet->type_id == $group->id);
                $bet->data = json_encode($standings);
                $bet->save();
                $betOnGroupIds->add($group->id);
            });
            collect($betData['games'])->each(function($resultData, $gameExtId) use ($utl, $betOnGameIds) {
                $game = $this->tournament->competition->games->firstWhere("external_id", $gameExtId);
                $bet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::Game && $bet->type_id == $game->id);
                $bet->data = json_encode(
                    ['result-home' => $resultData[0], 'result-away' => $resultData[1]]
                );
                $bet->save();
                $betOnGameIds->add($game->id);
            });
            
            $utl->bets()
                ->where('type', BetTypes::Game)->whereNotIn('type_id', $betOnGameIds->toArray())
                ->delete();
            
            $utl->bets()
                ->where('type', BetTypes::GroupsRank)->whereNotIn('type_id', $betOnGroupIds->toArray())
                ->delete();
        }
    }

    
    public function generateGameData($externalGames, $goalsByTeam)
    {
        $teamExtIds = array_keys($goalsByTeam);
        $game = $externalGames->first(fn(CrawlerGame $g) => in_array($g->teamHomeExternalId, $teamExtIds) && in_array($g->teamAwayExternalId, $teamExtIds) );
        foreach ($goalsByTeam as $teamExtId => $goals){
            if ($game->teamHomeExternalId == $teamExtId){
                $resultHome = $goals;
            } else {
                $resultAway = $goals;
            }
        }
        return [
            "externalId" => $game->externalId,
            "resultHome" => $resultHome,
            "resultAway" => $resultAway,
        ];
    }
    
    public function generateStandingsData($teamIds)
    {
        $standings = collect();
        foreach ($teamIds as $index => $teamId){
            $standings->add([
                "position" => 1 + $index,
                "team_ext_id" => $teamId,
            ]);
        }
        return $standings;
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
    protected function assertGroupStandings(\Illuminate\Support\Collection $externalGames, \Illuminate\Support\Collection $gamesData,  \Illuminate\Support\Collection $standings, $validateData = []): void
    {
        $games = collect([]);
        $gamesData->each(function($gameData) use ($externalGames, $games){
            /** @var \App\DataCrawler\Game $externalGame */
            $gameData = collect($gameData);
            $externalGame = $externalGames[collect($externalGames)->search(fn($g) => $g->externalId == $gameData["externalId"])];
            $externalGame->isDone               = true;
            $externalGame->isStarted            = true;
            $externalGame->resultHome           = $gameData["resultHome"];
            $externalGame->resultAway           = $gameData["resultAway"];
            $games->add($externalGame);
        });

        $offensiveTeamSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_OFFENSIVE_TEAM);



        $this->updateCompetition->fake($games, null, $standings);

        $this->updateCompetition->handle($this->competition);


        $this->tournament->refresh();
        $versionsOfLatestChange = $this->tournament->get2LatestRelevantVersions();


        $expectBetsScore = data_get($validateData, "scoreByUtlId");
        if ($expectBetsScore){
            foreach($expectBetsScore as $utlId => $expectedScores){
                $utl = $this->tournament->utls->find($utlId);
                $expectedOffensiveTeamScore = data_get($expectedScores, "offensiveTeam");
                if (!is_null($expectedOffensiveTeamScore)) {
                    $offensiveTeamBet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $offensiveTeamSpecialBet->id);
                    $this->assertEquals($expectedOffensiveTeamScore, $offensiveTeamBet->score);
                }
                $groupsData = data_get($expectedScores, "groups");
                foreach ($groupsData as $extId => $expectedScore){
                    $group = $this->tournament->competition->groups->first(fn($group) => $group->external_id == $extId);
                    $groupBet = $utl->bets->first(fn(Bet $bet) => $bet->type == BetTypes::GroupsRank && $bet->type_id == $group->id);
                    $this->assertEquals($expectedScore, $groupBet->score, "Bet GroupsRank [{$group->external_id}] utl: $utl->id");
                }
            }
        }

        $targetVersionRanks = data_get($validateData, "targetVersionRanks");
        if ($targetVersionRanks){
            $latestLeaderboards = $versionsOfLatestChange[0]->leaderboards;
            foreach($targetVersionRanks as $utlId => $expectedRank){
                $updatedRank = $latestLeaderboards->first(fn(Leaderboard $l) => $l->user_tournament_id == $utlId)->rank;
                $this->assertEquals($expectedRank, $updatedRank, "Expected Rank of UTL $utlId");
            }
        }
        $expectFinalScore = data_get($validateData, "scoredboardTotalScore");
        if ($expectFinalScore){
            $latestLeaderboards = $versionsOfLatestChange[0]->leaderboards;
            foreach($expectFinalScore as $utlId => $totalScore){
                $currentScore = $latestLeaderboards->first(fn($l) => $l->user_tournament_id == $utlId)->score;
                $this->assertEquals($totalScore, $currentScore);
            }
        }
        $expectAddedScore = data_get($validateData, "scoredboardAddedScore");
        if ($expectAddedScore){
            $latestLeaderboards = $versionsOfLatestChange[0]->leaderboards;
            $prevLeaderboards = $versionsOfLatestChange[1]->leaderboards;
            foreach($expectAddedScore as $utlId => $addedScore){
                $currentScore = $latestLeaderboards->first(fn($l) => $l->user_tournament_id == $utlId)->score;
                $prevScore = $prevLeaderboards->first(fn($l) => $l->user_tournament_id == $utlId)->score;
                $this->assertEquals($addedScore, $currentScore - $prevScore);
            }
        }
    }
}
