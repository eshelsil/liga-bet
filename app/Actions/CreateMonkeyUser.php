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

        $this->handleUtl($utl);
        
        return $user;
    }

    public function handleUtl(TournamentUser $utl): void
    {
        $tournament = $utl->tournament;

        $tournament->competition->groups
            ->each(fn (Group $group) => $this->betGroup($group, $utl));

        $tournament->competition->games
            ->each(fn(Game $game) => $this->betGame($game, $utl));

        $tournament->specialBets->each(fn(SpecialBet $specialBet) => $this->betSpecialBet($specialBet, $utl));
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
    private function betGame(Game $game, $utl): void
    {
        $type_id = $game->getID();
        $data    = $game->generateRandomBetData();
        $this->autoGenerateBet($utl, BetTypes::Game, $type_id, $data);
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