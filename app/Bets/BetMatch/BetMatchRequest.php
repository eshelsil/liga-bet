<?php

namespace App\Bets\BetMatch;

use App\Bets\AbstractBetRequest;
use App\Bets\BetableInterface;
use App\Exceptions\JsonException;
use App\Match;
use Illuminate\Support\Facades\Log;

class BetMatchRequest extends AbstractBetRequest
{
    protected $match = null;
    protected $resultHome = null;
    protected $resultAway = null;

    /**
     * BetMatchRequest constructor.
     *
     * @param Match $match
     * @param array $data
     */
    public function __construct($match, $data = []) {
        parent::__construct($match, $data);
        $this->resultHome = data_get($data, "result-home");
        $this->resultAway = data_get($data, "result-away");
    }

    public function toJson() {
        return json_encode(["result-home" => $this->resultHome, "result-away" => $this->resultAway]);
    }


    protected function validateData($match, $data)
    {
        Log::debug("Validating data: {$match->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $resultHome = data_get($data, "result-home");
        if (!ctype_digit($resultHome)) {
            throw new \InvalidArgumentException($resultHome);
        }
        $resultAway = data_get($data, "result-away");
        if (!ctype_digit($resultAway)) {
            throw new \InvalidArgumentException($resultHome);
        }
    }

    /**
     * @return Match
     */
    public function getMatch(): ?Match
    {
        return $this->match;
    }

    /**
     * @return int
     */
    public function getResultHome()
    {
        return $this->resultHome;
    }

    /**
     * @return int
     */
    public function getResultAway()
    {
        return $this->resultAway;
    }

    /**
     * @param BetMatchRequest $request
     *
     * @return int|mixed
     */
    public function calculate(AbstractBetRequest $request)
    {
        $score = 0;
        if ($request->getResultHome() == $this->getResultHome()
            && $request->getResultAway() == $this->getResultAway()) {
            $score += $this->getMatch()->getScore("score");
        }

        if (
            ($request->getResultHome() == $request->getResultAway()
            && $this->getResultHome() == $this->getResultAway()) // Teko
            || ($request->getResultHome() > $request->getResultAway()
            && $this->getResultHome() > $this->getResultAway()) // Winner Home
            || ($request->getResultHome() < $request->getResultAway()
            && $this->getResultHome() < $this->getResultAway()) // Winner Away
        ) {
            $score += $this->getMatch()->getScore("winner");
        }

        return $score;
    }

    protected function setEntity($entity = null)
    {
        $this->match = $entity;
    }

    /**
     * @return BetableInterface
     */
    public function getEntity()
    {
        return $this->match;
    }
}
