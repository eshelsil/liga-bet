<?php

namespace App;

use App\Enums\BetTypes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Query\JoinClause;

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
        return (new Match)->newQuery()->select(["matches.*"])->leftJoin("bets", function (JoinClause $j) {
            $j->on("type_id", "=", "matches.id")
                ->where("bets.type", BetTypes::Game)
                ->where("user_id", 1);
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
                  ->where("type", BetTypes::Game)
                  ->where("type_id", $match->id)
                  ->first();
    }
}
