<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 22/06/18
 * Time: 14:33
 */

namespace App\DataCrawler;

abstract class AbstractCrawlerMatch
{

    protected $type = null;
    protected $subType = null;
    protected $data = null;
    protected $repository = null;

    /**
     * CrawlerMatch constructor.
     *
     * @param string $type
     * @param string $subType
     * @param mixed $data
     * @param AbstractMatchesRepository $repository
     */
    public function __construct($type, $subType, $data, $repository)
    {
        $this->type       = $type;
        $this->subType    = $subType;
        $this->data       = $data;
        $this->repository = $repository;
    }

    public static function make($data, $repository)
    {
        return new static($data["type"], $data["subType"], $data, $repository);
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getSubType()
    {
        return $this->subType;
    }

    /**
     * @return string
     */
    public function getID()
    {
        return $this->getData("name");
    }

    public function getStartTime($format = "U")
    {
        $time =  \DateTime::createFromFormat(\DateTime::ISO8601, $this->getData("date"));
        return $time ? $time->format($format) : null;
    }

    abstract public function getTeamHomeID();

    abstract public function getTeamAwayID();

    public function isKnownTeams()
    {
        return $this->getTeamHomeID() && $this->getTeamAwayID();
    }

    public function getResultHome()
    {
        return $this->getData("home_result");
    }

    public function getResultAway()
    {
        return $this->getData("away_result");
    }

    public function getPenaltyHome()
    {
        return $this->getData("home_penalty");
    }

    public function getPenaltyAway()
    {
        return $this->getData("away_penalty");
    }

    public function isCompleted()
    {
        return !is_null($this->getResultHome()) && !is_null($this->getResultAway());
    }

    /**
     * @param      $key
     * @param null $default
     *
     * @return mixed
     */
    public function getData($key = null, $default = null)
    {
        return array_get($this->data, $key, $default);
    }


}