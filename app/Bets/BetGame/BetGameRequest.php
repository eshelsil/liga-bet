<?php

namespace App\Bets\BetGame;

use App\Match;

class BetGameRequest
{
    protected $match = null;
    protected $resultHome = null;
    protected $resultAway = null;

    /**
     * BetGameRequest constructor.
     *
     * @param       $matchId
     * @param array $data
     */
    public function __construct($matchId, array $data) {
        $this->validateData($matchId, $data);
        $this->match = Match::findOrFail($matchId);
        $this->resultHome = $data["result_home"];
        $this->resultAway = $data["result_away"];
    }

    public function toJson() {
        return json_encode(["result-home" => $this->resultHome, "result-away" => $this->resultAway]);
    }

    private function validateData($matchId, $data) {
        if (!ctype_digit($matchId)) {
            throw new \InvalidArgumentException();
        }
        if (!ctype_digit(array_get($data, "result-home"))) {
            throw new \InvalidArgumentException();
        }
        if (!ctype_digit(array_get($data, "result-away"))) {
            throw new \InvalidArgumentException();
        }
    }

    /**
     * @return Match
     */
    public function getMatch(): ?Match {
        return $this->match;
    }

    /**
     * @return int
     */
    public function getResultHome() {
        return $this->resultHome;
    }

    /**
     * @return int
     */
    public function getResultAway() {
        return $this->resultAway;
    }
}
