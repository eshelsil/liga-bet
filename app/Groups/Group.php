<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 26/06/18
 * Time: 02:41
 */

namespace App\Groups;

use App\Bets\BetableInterface;
use \Illuminate\Support\Collection;

class Group implements BetableInterface
{
    protected $id = null;
    protected $teamIDs = [];

    private static $source = [
        "1" => [1,2,3,4],
        "2" => [5,6,7,8],
        "3" => [9,10,11,12],
        "4" => [13,14,15,16],
        "5" => [17,18,19,20],
        "6" => [21,22,23,24],
        "7" => [25,26,27,28],
        "8" => [29,30,31,32],
    ];

    private static $finalRanks = [
        "1" => [4,1,2,3],
        "2" => [6,5,8,7],
        "3" => [9,12,11,10],
        "4" => [15,13,16,14],
        "5" => [17,18,20,19],
        "6" => [23,22,24,21],
        "7" => [25,28,27,26],
        "8" => [31,32,30,29],
    ];

    /**
     * Group constructor.
     *
     * @param null  $id
     * @param array $teamIDs
     */
    public function __construct($id, array $teamIDs)
    {
        $this->id      = $id;
        $this->teamIDs = $teamIDs;
    }

    public function getTeamIDByRank($rank)
    {
        return static::$finalRanks[$this->id][$rank-1];
    }

    public function getID()
    {
        return $this->id;
    }

    public function getTeamIDs()
    {
        return $this->teamIDs;
    }

    /**
     * @return Collection|static[]
     */
    public static function all()
    {
        $groups = [];
        foreach (self::$source as $id => $teamIDs) {
            $groups[] = new self($id, $teamIDs);
        }

        return Collection::make($groups);
    }

    /**
     * @param $id
     *
     * @return static
     */
    public static function find($id)
    {
        $teamIDs = array_get(self::$source, $id);
        return new self($id, $teamIDs);
    }
}