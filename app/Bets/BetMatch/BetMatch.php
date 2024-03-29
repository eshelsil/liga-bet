<?php

namespace App\Bets\BetMatch;

use App\Bet;
use App\Bets\AbstractBet;
use App\Game;
use App\User;

use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;

class BetMatch extends AbstractBet
{
    /** @var Bet $bet */
    protected $bet = null;
    /** @var Game $match */
    protected $match = null;
    /** @var User $user */
    protected $user = null;
    /** @var BetMatchRequest $request */
    protected $request = null;


    protected function setEntity($entity = null)
    {
        $this->match = $entity ?: Game::query()->find($this->bet->type_id);
    }

    protected function getEntity()
    {
        if (!$this->match) {
            $this->setEntity();
        }
        return $this->match;
    }

    protected static function getType()
    {
        return BetTypes::Game;
    }

    protected function setRequest()
    {
        $this->request = new BetMatchRequest($this->match, $this->bet->tournament, $this->bet->getData());
    }

    public function switchScore()
    {
        $this->request = new BetMatchRequest($this->match, $this->bet->tournament, ["result-home" => $this->request->getResultAway(), "result-away" => $this->request->getResultHome()]);
        $this->bet->data = $this->request->toJson();
        $this->bet->save();
    }
}