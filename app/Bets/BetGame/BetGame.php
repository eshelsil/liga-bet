<?php

namespace App\Bets\BetGame;

use App\Bet;
use App\Match;
use App\User;

use App\Enums\BetTypes;

class BetGame
{
    /** @var Bet $bet */
    protected $bet = null;
    /** @var Match $match */
    protected $match = null;
    /** @var User $user */
    protected $user = null;
    /** @var BetGameRequest $request */
    protected $request = null;
    /**
     * @param Match $match
     * @param User $user
     * @param BetGameRequest $request
     * @return Bet
     */
    public static function save($user, BetGameRequest $request) {
        // TODO: Throw exception if match already has score
        $bet = new Bet();
        $bet->type = BetTypes::Game;
        $bet->user_id = $user->id;
        $bet->type_id = $request->getMatch()->id;
        $bet->data = $request->toJson();
        $bet->save();
        return $bet;
    }
}
