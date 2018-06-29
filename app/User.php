<?php

namespace App;

use App\Bets\BetGroupRank\BetGroupRank;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Enums\BetTypes;
use App\Exceptions\JsonException;
use App\Groups\Group;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Log;

/**
 * Class User
 *
 * @property integer id
 * @property string name
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'phone', 'password', 'permissions'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function bets()
    {
        return $this->hasMany('App\Bet');
    }

    public static function create($params) : User {
        $user = new static($params);
        $user->save();

        return $user;
    }

    public function getOpenMatches() {
        return Match::query()->select(["matches.*"])->leftJoin("bets", function (JoinClause $j) {
            $j->on("type_id", "=", "matches.id")
                ->where("bets.type", BetTypes::Match)
                ->where("user_id", $this->id);
        })
            ->whereNotNull("team_home_id")
            ->whereNotNull("team_away_id")
            ->whereNull("type_id")
            ->get();
    }

    public function getBet(Match $match)
    {
        return Bet::query()
                  ->where("user_id", $this->id)
                  ->where("type", BetTypes::Match)
                  ->where("type_id", $match->id)
                  ->first();
    }

    public function insertGroupRankData($betsData)
    {
        echo "<br><br> User {$this->name}";

        foreach (Group::all() as $group) {
            $groupRank = [];
            foreach ($group->getTeamIDs() as $teamID){
                $rank = trim($betsData["tr{$teamID}"]);
                if (in_array($rank, array_keys($groupRank))){
                    throw new JsonException("double rank on group {$group->getID()} (rank {$rank})");
                }
                $groupRank[$rank] = $teamID;
            }
            $betRequest = new BetGroupRankRequest($group->getID(), [
                "team-a" => $groupRank["1"],
                "team-b" => $groupRank["2"],
                "team-c" => $groupRank["3"],
                "team-d" => $groupRank["4"],
            ]);
            $bet = BetGroupRank::save($this, $betRequest);

            echo "<br><br> Group {$group->getID()} Rank: " . $betRequest->toJson();
        }
    }
}
