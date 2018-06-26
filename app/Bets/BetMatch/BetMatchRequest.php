<?php

namespace App\Bets\BetMatch;

use App\Exceptions\JsonException;
use App\Match;
use Illuminate\Support\Facades\Log;

class BetMatchRequest
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
        Log::debug("Validating data: {$match->id}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $this->validateData($match, $data);
        $this->match = $match;
        $this->resultHome = data_get($data, "result-home");
        $this->resultAway = data_get($data, "result-away");
    }

    public function toJson() {
        return json_encode(["result-home" => $this->resultHome, "result-away" => $this->resultAway]);
    }

    /**
     * @param Match $match
     * @param array $data
     */
    private function validateData($match, $data)
    {
        Log::debug("Validating data: {$match->id}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $resultHome = data_get($data, "result-home");
        if (!ctype_digit($resultHome)) {
            throw new \InvalidArgumentException();
        }
        $resultAway = data_get($data, "result-away");
        if (!ctype_digit($resultAway)) {
            throw new \InvalidArgumentException();
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

    public function calculate()
    {
        $score = 0;
        if ($this->getMatch()->result_home == $this->getResultHome()
            && $this->getMatch()->result_away == $this->getResultAway()) {
            $score += $this->getMatch()->getScore("score");
        }

        if (
            ($this->getMatch()->result_home == $this->getMatch()->result_away
            && $this->getResultHome() == $this->getResultAway()) // Teko
            || ($this->getMatch()->result_home > $this->getMatch()->result_away
            && $this->getResultHome() > $this->getResultAway()) // Winner Home
            || ($this->getMatch()->result_home < $this->getMatch()->result_away
            && $this->getResultHome() < $this->getResultAway()) // Winner Away
        ) {
            $score += $this->getMatch()->getScore("winner");
        }

        return $score;
    }

}
