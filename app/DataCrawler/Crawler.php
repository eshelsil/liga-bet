<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 16/06/18
 * Time: 14:26
 */

namespace App\DataCrawler;

use App\DataCrawler\Knockouts\KnockoutMatchesRepository;
use \Illuminate\Support\Collection;
use \Guzzle\Http\Client as HttpClient;
class Crawler
{
    const URL = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json";

    protected static $instance = null;
    protected $data = null;

    public function getData($key = null, $default = null)
    {
        return data_get($this->data, $key, $default);
    }

    private function __clone()
    {

    }

    private function __wakeup()
    {

    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new static();
        }
        return self::$instance;
    }

    /**
     * Crawler constructor.
     */
    protected function __construct()
    {
        $this->queryData();
        $this->mockData();
    }

    private function queryData()
    {
        $client = new HttpClient();
        $res = $client->get(self::URL)->send();
        $this->data = json_decode($res->getBody());
    }

    public function getMatches($type)
    {
        $crawlerMatches = [];
        foreach ($this->getData($type) as $subType => $subTypeMatches) {
            foreach (data_get($subTypeMatches, "matches") as $matchData) {
                $crawlerMatches[] = array_merge((array)$matchData, compact("type", "subType"));
            }
        }

        return new Collection($crawlerMatches);
    }

    private function mockData()
    {
//        $this->data->groups->a->winner = 2;
//        $this->data->groups->a->runnerup = 4;
//        $this->data->groups->b->winner = 5;
//        $this->data->groups->b->runnerup = 8;

//        $this->data->knockout->round_16->matches[0]->winner = 2;
//        $this->data->knockout->round_16->matches[1]->winner = 5;
    }

    /**
     * @return Collection|AbstractCrawlerMatch[]
     */
    public function getKnockoutMatches()
    {
        return (new KnockoutMatchesRepository( $this->getMatches("knockout"), $this))->getMatches();
    }

    /**
     * @return Collection|static[]
     */
    public function getKnownOpenMatches()
    {
        $result = $this->getKnockoutMatches()
                       ->filter(function (AbstractCrawlerMatch $crawlerMatch) {
                           return ($crawlerMatch->isKnownTeams()
                                   && ! $crawlerMatch->isCompleted());
                       });

        return $result;
    }
}