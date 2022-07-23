<?php

namespace App\Bets;

use App\Bet;
use App\Game;
use App\TournamentUser;
use App\User;

use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;

abstract class AbstractBet
{
    /** @var Bet $bet */
    protected $bet = null;
    /** @var BetableInterface $entity */
    protected $entity = null;

    protected TournamentUser $utl;
    /** @var AbstractBetRequest $request */
    protected $request = null;
    /**
     * BetMatch constructor.
     *
     * @param Bet              $bet
     * @param BetableInterface $entity
     * @param TournamentUser|null        $user
     */
    public function __construct(Bet $bet, BetableInterface $entity = null, TournamentUser $utl = null)
    {
        $this->bet = $bet;
        $this->setEntity($entity);
        $this->setUTL($utl);

        $this->setRequest();

    }

    abstract protected function setEntity($entity = null);

    /**
     * @return BetableInterface
     */
    abstract protected function getEntity();

    private function setUTL(TournamentUser $utl = null)
    {
        $this->utl = $utl ?: $this->bet->utl;
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
     * @param TournamentUser     $utl
     * @param AbstractBetRequest $request
     * @return Bet
     */
    public static function save(TournamentUser $utl, AbstractBetRequest $request)
    {
        /** @var Bet $bet */
        $bet = Bet::query()->firstOrNew([
            "type"               => static::getType(),
            "user_tournament_id" => $utl->id,
            "tournament_id"      => $utl->tournament_id,
            "type_id"            => $request->getEntity()->getID(),
        ]);

        $bet->data = $request->toJson();
        $bet->score = null;
        $bet->save();


        return $bet;
    }
}