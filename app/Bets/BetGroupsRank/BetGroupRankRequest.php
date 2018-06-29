<?php

namespace App\Bets\BetGroupRank;

use App\Bets\AbstractBetRequest;
use App\Groups\Group;
use Illuminate\Support\Facades\Log;

class BetGroupRankRequest extends AbstractBetRequest
{
    protected $group = null;
    protected $teamA = null;
    protected $teamB = null;
    protected $teamC = null;
    protected $teamD = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param Group $group
     * @param array $data
     */
    public function __construct($group, $data = []) {
        parent::__construct($group, $data);
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
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param Group $group
     * @param array $data
     */
    protected function validateData($group, $data) {
        Log::debug("Validating data: {$group->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $this->validateTeamID(data_get($data, "team-a"));
        $this->validateTeamID(data_get($data, "team-b"));
        $this->validateTeamID(data_get($data, "team-c"));
        $this->validateTeamID(data_get($data, "team-d"));
    }

    private function validateTeamID($teamID)
    {
        if (!trans("teams.{$teamID}")) {
            throw new \InvalidArgumentException("invalid Team {$teamID}");
        }
    }

    public function getGroup()
    {
        return $this->group;
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

    public function calculate(AbstractBetRequest $finalRanks) {
        $score = 0;
        /** @var BetGroupRankRequest $finalRanks */
        if ($finalRanks->isQualifiedTeam($this->getTeamA())) {
            $score += 2;
        }
        if ($finalRanks->isQualifiedTeam($this->getTeamB())) {
            $score += 2;
        }
        if ($finalRanks->getTeamA() == $this->getTeamA()
            && $finalRanks->getTeamB() == $this->getTeamB()) {
            $score += 2;
            if ($finalRanks->getTeamC() == $this->getTeamC()
                && $finalRanks->getTeamD() == $this->getTeamD()) {
                $score += 2;

            }
        }

        return $score;
    }

    /**
     * @param int $teamId
     *
     * @return bool
     */
    private function isQualifiedTeam($teamId)
    {
        return in_array($teamId, [$this->getTeamA(), $this->getTeamB()]);
    }

    protected function setEntity($entity = null)
    {
        $this->group = $entity;
    }

    public function getEntity()
    {
        return $this->getGroup();
    }
}
