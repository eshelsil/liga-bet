<?php

namespace App\Bets\BetGroupRank;

use App\Exceptions\JsonException;
use App\Match;
use Illuminate\Support\Facades\Log;

class BetGroupRankRequest
{
    protected $match = null;
    protected $teamA = null;
    protected $teamB = null;
    protected $teamC = null;
    protected $teamD = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param Match $match // TODO: data array of group rank
     * @param array $data
     */
    public function __construct($match, $data = []) {
        Log::debug("Validating data: {$match->id}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $this->validateData($match, $data);
        $this->match      = $match;
        $this->teamA      = data_get($data, "team-a");
        $this->teamB      = data_get($data, "team-b");
        $this->teamC      = data_get($data, "team-c");
        $this->teamD      = data_get($data, "team-d");
    }

    public function toJson() {
        return json_encode([
            "team-a" => $this->teamA,
            "team-b" => $this->teamB,
            "team-c" => $this->teamC,
            "team-d" => $this->teamD,
        ]);
    }

    /**
     * @param Match $match
     * @param array $data
     */
    private function validateData($match, $data) {
        Log::debug("Validating data: {$match->id}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        if (!ctype_digit(data_get($data, "team-a"))) {
            throw new \InvalidArgumentException();
        }
        if (!ctype_digit(data_get($data, "team-b"))) {
            throw new \InvalidArgumentException();
        }
        if (!ctype_digit(data_get($data, "team-c"))) {
            throw new \InvalidArgumentException();
        }
        if (!ctype_digit(data_get($data, "team-d"))) {
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
    public function getTeamA() {
        return $this->teamA;
    }

    /**
     * @return int
     */
    public function getTeamB() {
        return $this->teamB;
    }

    /**
     * @return int
     */
    public function getTeamC() {
        return $this->teamC;
    }

    /**
     * @return int
     */
    public function getTeamD() {
        return $this->teamD;
    }

    public function calculate() {
        $score = 0;
        // TODO

        return $score;
    }

}
