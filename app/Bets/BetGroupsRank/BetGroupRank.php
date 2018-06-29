<?php

namespace App\Bets\BetGroupRank;

use App\Bet;
use App\Bets\AbstractBet;
use App\Bets\BetableInterface;
use App\Groups\Group;
use App\Match;
use App\User;

use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;

class BetGroupRank extends AbstractBet
{
    /** @var Group $group */
    protected $group = null;


    protected function setRequest()
    {
        $this->request = new BetGroupRankRequest($this->group, $this->bet->getData());
    }

    protected function setEntity($group = null)
    {
        $this->group = $group ?: Group::find($this->bet->type_id);
    }

    protected function getEntity()
    {
        return $this->group;
    }

    protected static function getType()
    {
        return BetTypes::GroupsRank;
    }

}
