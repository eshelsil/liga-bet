<?php

namespace App\Bets\BetSpecialBets;

use App\Bet;
use App\Bets\AbstractBet;
use App\Bets\BetableInterface;
use App\SpecialBets\SpecialBet;

use App\Enums\BetTypes;

class BetSpecialBets extends AbstractBet
{
    /** @var SpecialBet $group */
    protected $specialBet = null;


    protected function setRequest()
    {
        $this->request = new BetSpecialBetsRequest($this->specialBet, $this->bet->getData());
    }

    protected function setEntity($specialBet = null)
    {
        $this->specialBet = $specialBet ?: SpecialBet::find($this->bet->type_id);
    }

    protected function getEntity()
    {
        return $this->specialBet;
    }

    protected static function getType()
    {
        return BetTypes::SpecialBet;
    }

}
