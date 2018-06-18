<?php

namespace App\Bets\BetGame;

use App\Bet;
use App\Match;
use App\User;

use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;

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
     * BetGame constructor.
     *
     * @param Bet        $bet
     * @param Match|null $match
     * @param User|null  $user
     */
    public function __construct(Bet $bet,Match $match = null , User $user = null)
    {
        $this->bet = $bet;
        $this->setMatch($match);
        $this->setUser($user);

        $this->setRequest();

    }

    private function setMatch(Match $match = null)
    {
        $this->match = $match ?: Match::query()->find($this->bet->type_id);
    }

    private function setUser(User $user = null)
    {
        $this->user = $user ?: User::query()->find($this->bet->user_id);
    }

    private function setRequest()
    {
        $this->request = new BetGameRequest($this->match, $this->bet->getData());
    }

    public function getRequest()
    {
        if (!$this->request) {
            $this->setRequest();
        }
        return $this->request;
    }

    /**
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


    public function switchScore()
    {
        $this->request = new BetGameRequest($this->match, ["result-home" => $this->request->getResultAway(), "result-away" => $this->request->getResultHome()]);
        $this->bet->data = $this->request->toJson();
        $this->bet->save();
    }
}
