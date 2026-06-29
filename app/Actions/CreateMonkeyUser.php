<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Enums\BetTypes;
use App\Enums\WinnerSide;
use App\Game;
use App\Group;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Faker\Generator as FakerGenerator;
use Illuminate\Support\Str;

class CreateMonkeyUser
{
    public function __construct() {
    }

    public function handle(Tournament $tournament, ?string $name = null): User
    {
        $user = $this->createUser();
        $name ??= 'monkey_' . rand(0, 9999);
        $utl = $tournament->createUTL($user, $name);

        $tournament->competition->groups
            ->each(fn (Group $group) => $this->betGroup($group, $utl));

        $tournament->specialBets->each(fn(SpecialBet $specialBet) => $this->betSpecialBet($specialBet, $utl));

        $winnerSb = SpecialBet::getByType($tournament->id, SpecialBet::TYPE_WINNER);
        $runnerSb = SpecialBet::getByType($tournament->id, SpecialBet::TYPE_RUNNER_UP);
        $selectedBracketWinners = $utl->getWinnerAndRunnerUpTeams($winnerSb?->id, $runnerSb?->id);
        $tournament->competition->games
            ->each(fn(Game $game) => $this->betGame($game, $utl, $selectedBracketWinners->get('winner'), $selectedBracketWinners->get('runner_up')));
        return $user;
    }


    /**
     * The side the monkey backs in a knockout game: its Winner's side if the Winner plays, otherwise
     * its Runner-Up's side, otherwise null (random). Winner precedence covers Winner-vs-Runner-Up ties.
     */
    private function desiredWinnerSide(Game $game, ?int $desiredWinner, ?int $desiredRunnerUp): ?WinnerSide
    {
        if (!$game->isKnockout()) {
            return null;
        }
        foreach ([$desiredWinner, $desiredRunnerUp] as $teamId) {
            if (!$teamId) {
                continue;
            }
            if ($game->team_home_id === $teamId) {
                return WinnerSide::HOME;
            }
            if ($game->team_away_id === $teamId) {
                return WinnerSide::AWAY;
            }
        }
        return null;
    }

    /**
     * @return User
     */
    protected function createUser(): User
    {
        return User::create([
            'email'       => Str::uuid()."@liga-bet.com",
            'password'    => '',
            'permissions' => User::TYPE_MONKEY
        ]);
    }

    private function autoGenerateBet(TournamentUser $utl, int $type, int $type_id, $data)
    {
        $bet = new Bet();
        $bet->user_tournament_id = $utl->id;
        $bet->tournament_id = $utl->tournament_id;
        $bet->type = $type;
        $bet->type_id = $type_id;
        $bet->data = $data;
        $bet->save();
    }

    /**
     * @param $group
     * @param $utl
     *
     * @return void
     */
    private function betGroup(Group $group, $utl): void
    {
        $type_id = $group->getID();
        $data    = $group->generateRandomBetData();
        $this->autoGenerateBet($utl, BetTypes::GroupsRank, $type_id, $data);
    }

    /**
     * @param Game $game
     * @param      $utl
     *
     * @return void
     */
    private function betGame(Game $game, TournamentUser $utl, ?int $desiredWinner, ?int $desiredRunnerUp): void
    {
        $desiredWinnerSide = $this->desiredWinnerSide($game, $desiredWinner, $desiredRunnerUp);
        $data = $game->generateRandomBetData(true, $desiredWinnerSide);
        $this->autoGenerateBet($utl, BetTypes::Game, $game->getID(), $data);
    }

    /**
     * @param $specialBet
     * @param $utl
     *
     * @return void
     */
    private function betSpecialBet(SpecialBet $specialBet, $utl): void
    {
        $type_id = $specialBet->getID();
        $data    = $specialBet->generateRandomBetData();
        $this->autoGenerateBet($utl, BetTypes::SpecialBet, $type_id, $data);
    }
}