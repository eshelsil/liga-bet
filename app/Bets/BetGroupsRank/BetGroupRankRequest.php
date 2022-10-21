<?php

namespace App\Bets\BetGroupsRank;

use App\Bets\AbstractBetRequest;
use App\Bets\BetableInterface;
use App\Team;
use App\Group;
use App\Tournament;
use Illuminate\Support\Facades\Log;

class BetGroupRankRequest extends AbstractBetRequest
{
    protected Group $group;
    protected $standings = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param Group $group
     * @param array $data
     */
    public function __construct(BetableInterface $group, Tournament $tournament, array $data = []) {
        parent::__construct($group, $tournament, $data);
        $this->standings = $data;
    }

    public function toJson() {
        return json_encode($this->standings);
    }

    /**
     * @param Group $group
     * @param array $data
     */
    protected function validateData($group, $data) {
        Log::debug("Validating data: {$group->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $passed_positions = array_keys($data);
        sort($passed_positions);
        if (json_encode($passed_positions) !== json_encode([0, 1, 2, 3]) ){
            throw new \InvalidArgumentException("Invalid standing positions. \n
                    Got: ". json_encode($passed_positions). ". \n Must use: '1,2,3,4'");
        }
        $passed_team_ids = array_values($data);
        sort($passed_team_ids);
        $group_team_ids = $group->teams->modelKeys();
        sort($group_team_ids);
        if (json_encode($passed_team_ids) !== json_encode($group_team_ids) ){
                throw new \InvalidArgumentException("Invalid standing team_ids. \n Got: " . json_encode($passed_team_ids). "\nGroup includes teams: ". json_encode($group_team_ids));
        }
    }


    /**
     * @return [
     *  1 => team_id
     *  2 => team_id
     *  3 => team_id
     *  4 => team_id
     * ]
     */
    public function getRanking()
    {
        return $this->standings;
    }

    public function calculate()
    {
        $finalRanks = $this->group->getStandings();
        $ranking = $this->getRanking();
        $minorMistakesCounter = 0;
        foreach($ranking as $position => $team_id){
            $team_id = (string)$team_id;

            if ($finalRanks[$position] == $team_id){
                continue;
            }

            if ($this->isMinimalError($position, $finalRanks, $team_id)) {
                $minorMistakesCounter += 1;
            }

            if ($minorMistakesCounter >= 3) {
                return 0;
            }
        }

        if ($minorMistakesCounter) {
            return $this->getScoreConfig("groupRankBets.minorMistake");
        }

        return $this->getScoreConfig("groupRankBets.perfect");
    }

    protected function setEntity($entity = null)
    {
        $this->group = $entity;
    }

    public function getEntity()
    {
        return $this->group;
    }

    /**
     * @param int|string $position
     * @param array      $finalRanks
     * @param string     $team_id
     *
     * @return bool
     */
    protected function isMinimalError(
        int|string $position,
        array $finalRanks,
        string $team_id
    ): bool {
        return ($position + 1 <= 4 && $finalRanks[$position + 1] == $team_id)
               || ($position - 1 >= 1
                   && $finalRanks[$position - 1] == $team_id);
    }
}
