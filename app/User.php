<?php

namespace App;

use App\Bets\BetGroupRank\BetGroupRank;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Bets\BetSpecialBets\BetSpecialBets;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
use App\Exceptions\JsonException;
use App\Group;
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

    public function isConfirmed()
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


    public function getGroupBetsById() {
        $groups = Group::all();
        $bets = Bet::query()
            ->where("type", BetTypes::GroupsRank)
            ->where("user_id", $this->id)
            ->get();
        $output = [];
        foreach ($groups as $group) {
            $group->bet = $bets->first(function ($bet) use ($group) { return $bet->type_id == $group->id; });
            $group->teamsById = $group->getGroupTeamsById();
            $output[$group->id] = $group;
        }
        return $output;
    }

    public function getBet(Match $match)
    {
        return Bet::query()
                  ->where("user_id", $this->id)
                  ->where("type", BetTypes::Match)
                  ->where("type_id", $match->id)
                  ->first();
    }

    public function getSpecialBetsById()
    {
        $specialBets = SpecialBet::all();
        $bets = Bet::query()
                  ->where("user_id", $this->id)
                  ->where("type", BetTypes::SpecialBet)
                  ->get();

        $output = [];
        foreach ($specialBets as $specialBet) {
            $specialBet->bet = $bets->first(function ($bet) use ($specialBet) { return $bet->type_id == $specialBet->getID(); });
            $output[$specialBet->getID()] = $specialBet;
        }
        return $output;
    }
}
