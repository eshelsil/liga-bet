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
        $this->koWinnerSide = null;
        if ($this->match->isKnockout() ){
            $this->koWinnerSide = data_get($data, "winner_side");
        }
    }

    public function toJson() {
        return json_encode([
            "result-home" => $this->resultHome,
            "result-away" => $this->resultAway,
            "ko_winner_side" => $this->koWinnerSide,
        ], JSON_UNESCAPED_UNICODE);
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
        if ($match->isKnockout()){
            $koWinnerSide = data_get($data, "winner_side", null);
            if ((int)$resultAway == (int)$resultHome && !in_array($koWinnerSide, ["home", "away"])){
                $paramString = is_null($koWinnerSide) ? "null" : $koWinnerSide;
                throw new \InvalidArgumentException("Knockout Bet's \"winner_side\" parameter must be one of [\"away\", \"home\"] if score is tied. <br>Got: {$paramString}");
            }
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

    public function getWinnerSide()
    {
        if ($this->resultHome > $this->resultAway){
            return "home";
        } else if ($this->resultHome < $this->resultAway){
            return "away";
        }
        return $this->koWinnerSide;
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
        
        $match = $this->getMatch();
        $is_1x2_success = ($request->getResultHome() == $request->getResultAway()
            && $this->getResultHome() == $this->getResultAway()) // Teko
            || ($request->getResultHome() > $request->getResultAway()
            && $this->getResultHome() > $this->getResultAway()) // Winner Home
            || ($request->getResultHome() < $request->getResultAway()
            && $this->getResultHome() < $this->getResultAway()); // Winner Away
        if ($is_1x2_success) {
            $score += $match->getScore("1X2");
        }
        if ($match->isKnockout()){
            if ($this->getWinnerSide() == $match->getKnockoutWinnerSide()) {
                $score += $match->getScore("winner");
            }
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
