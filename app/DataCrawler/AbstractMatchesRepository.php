<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 22/06/18
 * Time: 17:09
 */

namespace App\DataCrawler;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;

abstract class AbstractMatchesRepository implements Arrayable
{

    protected $crawler = null;
    protected $matches = null;
    /** @var AbstractCrawlerMatch $abstractCrawlerMatch */
    protected $abstractCrawlerMatch = null;

    /**
     * AbstractMatchesRepository constructor.
     *
     * @param $matches
     * @param $crawler
     */
    public function __construct($matches, $crawler)
    {
        $this->matches = new Collection($this->toCrawlerMatches($matches));
    }

    private function toCrawlerMatches($matches)
    {
        $items = [];
        foreach ($matches as $match) {
            $items[] = $this->abstractCrawlerMatch::make($match, $this);
        }
        return $items;
    }

    /**
     * @param $matchID
     *
     * @return AbstractMatchesRepository
     */
    public function getMatchByID($matchID)
    {
        return $this->matches->first(function (AbstractCrawlerMatch $crawlerMatch) use ($matchID) {
            return $crawlerMatch->getID() == $matchID;
        });
    }

    public function getMatches()
    {
        return $this->matches;
    }

    public function toArray()
    {
        return $this->matches;
    }
}