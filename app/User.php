<?php

namespace App;

use App\Bets\BetGroupRank\BetGroupRank;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Bets\BetSpecialBets\BetSpecialBets;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
use App\Exceptions\JsonException;
use App\Groups\Group;
use App\SpecialBets\SpecialBet;
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
        'name', 'username', 'password', 'permissions'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    const TYPE_ADMIN = 2;
    const TYPE_CONFIRMED = 1;
    const TYPE_NOT_CONFIRMED = 0;

    public function isAdmin()
    {
        return $this->permissions == self::TYPE_ADMIN;
    }

    private function isConfirmed()
    {
        return $this->permissions > 0;
    }

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
        $matches = Match::query()->whereNotNull("team_home_id")
            ->whereNotNull("team_away_id")
            ->where("start_time", ">", time())
            ->get();

        $bets = Bet::query()
            ->whereIn("type_id", $matches->pluck("id")->all())
            ->where("type", BetTypes::Match)
            ->where("user_id", $this->id)
            ->get();

        foreach ($matches as $match) {
            $match->bet = $bets->first(function ($bet) use ($match) { return $bet->type_id == $match->id; });
        }

        return $matches;
    }

    public function getBet(Match $match)
    {
        return Bet::query()
                  ->where("user_id", $this->id)
                  ->where("type", BetTypes::Match)
                  ->where("type_id", $match->id)
                  ->first();
    }

    public function getSpecialBets()
    {
        $bets = Bet::query()
                  ->where("user_id", $this->id)
                  ->where("type", BetTypes::SpecialBet)
                  ->get();

        foreach ($bets as $bet) {
            $bet->specialBet = SpecialBet::find($bet->type_id);
        }

        return $bets;
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
            $betRequest = new BetGroupRankRequest($group, [
                "team-a" => $groupRank["1"],
                "team-b" => $groupRank["2"],
                "team-c" => $groupRank["3"],
                "team-d" => $groupRank["4"],
            ]);
            $bet = BetGroupRank::save($this, $betRequest);

            echo "<br><br> Group {$group->getID()} Rank: " . $betRequest->toJson();
        }
    }

    public function insertSpecialBetsData($betsData, $parseGuide)
    {
        echo "<br><br> User {$this->name}";

        foreach ($parseGuide as $specialBetID => $answerColumns) {
            $special = SpecialBet::find($specialBetID);
            $answers = [];
            foreach ($answerColumns as $column) {
                $answers[] = trim($betsData[$column]);
            }

            $betRequest = new BetSpecialBetsRequest($special, ["answers" => array_sort($answers)]);
            $bet = BetSpecialBets::save($this, $betRequest);

            echo "<br><br> SpecialBet {$special->getID()} Answer: " . $betRequest->toJson();
        }
        echo "</body></html>";
    }
}
