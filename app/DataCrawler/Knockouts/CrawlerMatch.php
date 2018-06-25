<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 22/06/18
 * Time: 16:24
 */

namespace App\DataCrawler\Knockouts;

use App\DataCrawler\AbstractCrawlerMatch;
use App\DataCrawler\Crawler;
use App\Team;

class CrawlerMatch extends AbstractCrawlerMatch
{
    public function getTeamHomeID()
    {
        $team = $this->getData("home_team");
        return is_numeric($team) ? $this->getTeamByInt($team) : $this->parseByGroup($team);
    }

    public function getTeamAwayID()
    {
        $team = $this->getData("away_team");
        return is_numeric($team) ? $this->getTeamByInt($team) : $this->parseByGroup($team);
    }

    /** id might be a team id or winner of a match id
     * @param int $id
     *
     * @return int|null
     */
    private function getTeamByInt($id)
    {
        if (Team::query()->find($id)) {
            return $id;
        }

        return $this->parseByKnockoutWinner($id);

    }

    /**
     * @return int|null
     */
    private function getWinnerID() {
        return $this->getData("winner");
    }

    private function parseByGroup($rankGroup)
    {
        $rank = explode("_", $rankGroup)[0] == "winner" ? "winner" : "runnerup";
        $groupName = explode("_", $rankGroup)[1];

        return Crawler::getInstance()->getData("groups.{$groupName}.{$rank}");
    }

    /**
     * @param $id
     *
     * @return int|null
     */
    private function parseByKnockoutWinner($id)
    {
        /** @var self $match */
        $match = $this->repository->getMatchByID($id);

        return $match->getWinnerID();
    }

}