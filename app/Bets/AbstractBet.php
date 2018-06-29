<?php

namespace App\Bets;

use App\Bet;
use App\Match;
use App\User;

use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;

abstract class AbstractBet
{
    /** @var Bet $bet */
    protected $bet = null;
    /** @var BetableInterface $entity */
    protected $entity = null;
    /** @var User $user */
    protected $user = null;
    /** @var AbstractBetRequest $request */
    protected $request = null;
    /**
     * BetMatch constructor.
     *
     * @param Bet              $bet
     * @param BetableInterface $entity
     * @param User|null        $user
     */
    public function __construct(Bet $bet, BetableInterface $entity = null, User $user = null)
    {
        $this->bet = $bet;
        $this->setEntity($entity);
        $this->setUser($user);

        $this->setRequest();

    }

    abstract protected function setEntity($entity = null);

    /**
     * @return BetableInterface
     */
    abstract protected function getEntity();

    private function setUser(User $user = null)
    {
        $this->user = $user ?: User::query()->find($this->bet->user_id);
    }

    abstract protected function setRequest();

    public function getRequest()
    {
        if (!$this->request) {
            $this->setRequest();
        }
        return $this->request;
    }

    abstract protected static function getType();

    /**
     * @param User               $user
     * @param AbstractBetRequest $request
     * @return Bet
     */
    public static function save($user, AbstractBetRequest $request)
    {
        /** @var Bet $bet */
        $bet = self::firstOrCreateUserBet($user->id, $request->getEntity()->getID());

        $bet->data = $request->toJson();
        $bet->score = null;
        $bet->save();


        return $bet;
    }

    private static function firstOrCreateUserBet($userID, $typeID)
    {
        $bet = Bet::query()->where($wheres = [
            "type"    => static::getType(),
            "user_id" => $userID,
            "type_id" => $typeID,
        ])->first();

        if (!$bet) {
            Bet::unguard();
            $bet = new Bet($wheres);
            Bet::reguard();
        }

        return $bet;
    }
}