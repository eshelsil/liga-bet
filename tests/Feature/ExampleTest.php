<?php

namespace Tests\Feature;

use App\Actions\CreateMonkeyUser;
use App\Actions\CreateTournament;
use App\Actions\UpdateCompetition;
use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Support\Collection;
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

        $betsData = collect([
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [1,2], "score" => 6, "scorerScore" => 8, "assistsScore" => 6],
                    2 => ["guess" => [2,1], "score" => 0, "scorerScore" => 8, "assistsScore" => 6]
                ],
                "scorer"  => $utl1Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[1]->teamAwayExternalId)->players->get(0),
                "assists" => $utl1Assist = $this->competition->teams->firstWhere("external_id", $externalGames[1]->teamAwayExternalId)->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,2], "score" => 0, "scorerScore" => 0, "assistsScore" => 0],
                    2 => ["guess" => [0,0], "score" => 2, "scorerScore" => 4, "assistsScore" => 0, "live" => [
                        "score" => 0, "scorerScore" => 4, "assistsScore" => 0
                    ]],
                ],
                "scorer"  => $utl2Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamAwayExternalId)->players->get(0),
                "assists" => $utl2Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamAwayExternalId)->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,4], "score" => 2, "scorerScore" => 0, "assistsScore" => 0],
                    2 => ["guess" => [1,2], "score" => 0, "scorerScore" => 8, "assistsScore" => 0, "live" => [
                        "score" => 2, "scorerScore" => 0, "assistsScore" => 0
                    ]],
                ],
                "scorer"  => $utl3Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamHomeExternalId)->players->get(0),
                "assists" => $utl3Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]->teamHomeExternalId)->players->get(1),
            ],
        ]);

        $this->makePreBets($betsData);

        $this->assertEquals(62*3, $this->tournament->bets()->count());

        // Assert game 1
        $scorers = collect([
            new \App\DataCrawler\Player($utl1Scorer->external_id, "test", $utl1Scorer->team->external_id, goals: 2, assists: 1),
            new \App\DataCrawler\Player($utl1Assist->external_id, "test", $utl1Assist->team->external_id, goals: 1, assists: 2),
        ]);

        $this->assertGame($externalGames, 1, $betsData, 1, 2, $scorers);

        // Assert LIVE game 2
        $scorers = collect([
            new \App\DataCrawler\Player($utl2Scorer->external_id, "test", $utl2Scorer->team->external_id, goals: 1, assists: 0),
            new \App\DataCrawler\Player($utl2Assist->external_id, "test", $utl2Assist->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl3Scorer->external_id, "test", $utl3Scorer->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl3Assist->external_id, "test", $utl3Assist->team->external_id, goals: 1, assists: 0),
        ]);
        $this->assertGame($externalGames, 2, $betsData, 0, 1, $scorers, true);


        // Assert game 2
        $scorers = collect([
            new \App\DataCrawler\Player($utl2Scorer->external_id, "test", $utl2Scorer->team->external_id, goals: 1, assists: 0),
            new \App\DataCrawler\Player($utl2Assist->external_id, "test", $utl2Assist->team->external_id, goals: 0, assists: 0),
            new \App\DataCrawler\Player($utl3Scorer->external_id, "test", $utl3Scorer->team->external_id, goals: 2, assists: 0),
            new \App\DataCrawler\Player($utl3Assist->external_id, "test", $utl3Assist->team->external_id, goals: 2, assists: 0),
        ]);
        $this->assertGame($externalGames, 2, $betsData, 1, 1, $scorers);

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
    protected function assertGame(\Illuminate\Support\Collection $externalGames, int $externalId, \Illuminate\Support\Collection $betsData, int $resultHome, int $resultAway, ?\Illuminate\Support\Collection $scorers = null, bool $isLive = false): void
    {
        /** @var \App\DataCrawler\Game $externalGame */
        $externalGame = $externalGames[$externalId];
        $externalGame->isDone               = true;
        $externalGame->isStarted            = true;
        $externalGame->resultHome           = $resultHome;
        $externalGame->resultAway           = $resultAway;

        $scorerSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        $assistsSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);

        $betsWithScores = collect();
        foreach ($betsData as  $betData) {
            $gameBet = null;
            if ($isLive) {

                $gameScore = $betData["games"][$externalId]["live"]["score"] ?? $betData["games"][$externalId]["score"];
                $scorerScore = $betData["games"][$externalId]["live"]["scorerScore"] ?? $betData["games"][$externalId]["scorerScore"];
                $assistsScore = $betData["games"][$externalId]["live"]["assistsScore"] ?? $betData["games"][$externalId]["assistsScore"];
            } else {
                if ($betData["games"][$externalId]["live"]["score"] ?? null) {
                    /** @var Game $game */
                    $game = $this->competition->games->firstWhere("external_id", $externalGame->externalId);
                    $gameBet = $betData["utl"]->bets->first(fn(Bet $bet) => $bet->type == BetTypes::Game && $bet->type_id == $game->id);
                }

                $gameScore = $betData["games"][$externalId]["score"];
                $scorerScore = $betData["games"][$externalId]["scorerScore"];
                $assistsScore = $betData["games"][$externalId]["assistsScore"];
            }

            $gameBet ??= $this->updateUserGameBet(
                $externalGames[$externalId],
                $betData["utl"],
                $betData["games"][$externalId]["guess"][0],
                $betData["games"][$externalId]["guess"][1]
            );

            $betsWithScores[] = [
                "gameBet" => $gameBet,
                "gameScore" => $gameScore,

                "scorerBet" => $betData["utl"]->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $scorerSpecialBet->id),
                "scorerScore" => $scorerScore,

                "assistsBet" => $betData["utl"]->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $assistsSpecialBet->id),
                "assistsScore" => $assistsScore,
            ];
        }

        $this->updateCompetition->fake(collect([$externalGames[$externalId]]), $scorers);
        if($isLive) {
            $this->tournament->unsetRelation("leaderboardVersionsLatest");
            $latestLBId = $this->tournament->leaderboardVersionsLatest->id;
            $result = $this->updateCompetition->handleLive($this->competition)[$this->tournament->id];
        } else {
            $latestLBId = null;
            $result = [];
            $this->updateCompetition->handle($this->competition);
        }

        $betsWithScores->each(function(array $betWithScore, $i) use ($result, $isLive, $scorerSpecialBet, $assistsSpecialBet, $latestLBId, $externalId) {
            if ($isLive) {
                $betsById = $result["bets"][$betWithScore["gameBet"]->user_tournament_id]->keyBy("id");
                $betWithScore["gameBet"]    = $betsById[$betWithScore["gameBet"]->id];
                $betWithScore["scorerBet"]  = $betsById[$betWithScore["scorerBet"]->id];
                $betWithScore["assistsBet"] = $betsById[$betWithScore["assistsBet"]->id];

                $this->assertNotEquals($latestLBId, $result["leaderboard"]->id);
                $this->assertEquals($this->tournament->leaderboardVersionsLatest->id, $latestLBId);
            } else {
                $betWithScore["gameBet"]->refresh();
                $betWithScore["scorerBet"]->refresh();
                $betWithScore["assistsBet"]->refresh();
            }

            $this->assertEquals($betWithScore["gameScore"], $betWithScore["gameBet"]->score, "Bet[{$externalId}][{$isLive}] 'game' of user (".($i+1).")");
            $this->assertEquals($betWithScore["scorerScore"], $betWithScore["scorerBet"]->score, "Bet[{$externalId}][{$isLive}] 'goals' of user (".($i+1).")");
            $this->assertEquals($betWithScore["assistsScore"], $betWithScore["assistsBet"]->score, "Bet[{$externalId}][{$isLive}] 'assists' of user (".($i+1).")");

        });
    }
}
