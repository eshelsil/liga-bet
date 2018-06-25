<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 22/06/18
 * Time: 16:24
 */

namespace App\DataCrawler\Groups;

use App\DataCrawler\AbstractCrawlerMatch;

class CrawlerMatch extends AbstractCrawlerMatch
{
    public function getWinnerID() {
        return $this->getData("winner");
    }

    public function getTeamHomeID()
    {
        return $this->getData("home_team");
    }

    public function getTeamAwayID()
    {
        return $this->getData("away_team");
    }


}