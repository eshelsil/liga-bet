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
                    1 => ["guess" => [1,2], "score" => 6, "scorerScore" => 8, "assistsScore" => 2],
                    2 => ["guess" => [2,1], "score" => 0, "scorerScore" => 8, "assistsScore" => 2]
                ],
                "scorer"  => $utl1Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[1]["team_away_external_id"])->players->get(0),
                "assists" => $utl1Assist = $this->competition->teams->firstWhere("external_id", $externalGames[1]["team_away_external_id"])->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,2], "score" => 0, "scorerScore" => 0, "assistsScore" => 0],
                    2 => ["guess" => [0,0], "score" => 2, "scorerScore" => 4, "assistsScore" => 0],
                ],
                "scorer"  => $utl2Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]["team_away_external_id"])->players->get(0),
                "assists" => $utl2Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]["team_away_external_id"])->players->get(1),
            ],
            [
                "utl" => $this->createMonkeyUser->handle($this->tournament)->utls->first(),
                "games" => [
                    1 => ["guess" => [2,4], "score" => 2, "scorerScore" => 0, "assistsScore" => 0],
                    2 => ["guess" => [1,2], "score" => 0, "scorerScore" => 8, "assistsScore" => 0],
                ],
                "scorer"  => $utl3Scorer = $this->competition->teams->firstWhere("external_id", $externalGames[2]["team_home_external_id"])->players->get(0),
                "assists" => $utl3Assist = $this->competition->teams->firstWhere("external_id", $externalGames[2]["team_home_external_id"])->players->get(1),
            ],
        ]);

        $this->makePreBets($betsData);

        $this->assertEquals(62*3, $this->tournament->bets()->count());

        $scorers = collect([
            new \App\DataCrawler\Player($utl1Scorer->external_id, "test", $utl1Scorer->team->external_id, goals: 2, assists: 1),
            new \App\DataCrawler\Player($utl1Assist->external_id, "test", $utl1Assist->team->external_id, goals: 1, assists: 2),
        ]);

        $this->assertGame($externalGames, 1, $betsData, 1, 2, $scorers);

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
    protected function updateUserGameBet(array $externalGame, TournamentUser $utl, int $resultHome, int $resultAway, ?string $koWinner = null): Bet
    {
        /** @var Game $game */
        $game = $this->competition->games->firstWhere("external_id", $externalGame["external_id"]);

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
     * @param \Illuminate\Support\Collection $externalGames
     * @param int                            $externalId
     * @param \Illuminate\Support\Collection $betsData
     * @param                                $resultHome
     * @param                                $resultAWay
     *
     * @return void
     */
    protected function assertGame(\Illuminate\Support\Collection $externalGames, int $externalId, \Illuminate\Support\Collection $betsData, $resultHome, $resultAWay, ?\Illuminate\Support\Collection $scorers = null): void
    {
        $externalGames[$externalId] = array_merge($externalGames[$externalId], [
            "is_done"               => true,
            "result_home"           => $resultHome,
            "result_away"           => $resultAWay,
            "ko_winner_external_id" => $externalGames[$externalId]["team_away_external_id"]
        ]);

        $scorerSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_TOP_SCORER);
        $assistsSpecialBet = $this->tournament->specialBets->firstWhere("type", SpecialBet::TYPE_MOST_ASSISTS);

        $betsWithScores = $betsData->map(fn(array $betData) => [
            $this->updateUserGameBet(
                $externalGames[$externalId],
                $betData["utl"],
                $betData["games"][$externalId]["guess"][0],
                $betData["games"][$externalId]["guess"][1]
            ),
            $betData["games"][$externalId]["score"],

            $betData["utl"]->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $scorerSpecialBet->id),
            $betData["games"][$externalId]["scorerScore"],

            $betData["utl"]->bets->first(fn(Bet $bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $assistsSpecialBet->id),
            $betData["games"][$externalId]["assistsScore"],
        ]);

        $this->updateCompetition->fake(collect([$externalGames[$externalId]]), $scorers);
        $this->updateCompetition->handle($this->competition);

        $betsWithScores->each(function(array $betWithScore) {
            $betWithScore[0]->refresh();
            $this->assertEquals($betWithScore[1], $betWithScore[0]->score);

            $betWithScore[2]->refresh();
            $this->assertEquals($betWithScore[3], $betWithScore[2]->score);

            $betWithScore[4]->refresh();
            $this->assertEquals($betWithScore[5], $betWithScore[4]->score);
        });
    }
}
