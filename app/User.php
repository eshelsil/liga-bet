<?php

namespace App;

use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use Fcm\FcmClient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class User
 *
 * @property integer id
 * @property string name
 * @property string fcm_token
 * @property  Bet[]|Collection   bets
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
    const TYPE_MONKEY = -1;

    public function isAdmin()
    {
        return $this->permissions == self::TYPE_ADMIN;
    }

    public function isConfirmed()
    {
        return $this->permissions > 0;
    }

    public function isMonkey()
    {
        return $this->permissions == self::TYPE_MONKEY;
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

    public static function getIdToNameMap(){
        return static::all()->groupBy('id')->map(function($u){
            return $u->first()->name;
        });
    }

    public static function getMonkeyUsers(){
        return static::where('permissions', static::TYPE_MONKEY)->get();
    }

    private function autoGenerateBet($type, $type_id, $data){
        if (!$this->isMonkey()){
            throw new \InvalidArgumentException("Cannot auto-generate bets for a user who is not a monkey");
        }
        $bet = new Bet();
        $bet->user_id = $this->id;
        $bet->type = $type;
        $bet->type_id = $type_id;
        $bet->data = $data;
        $bet->save();
    }

    public function autoBetPreTournament(){
        if (!$this->isMonkey()){
            throw new \InvalidArgumentException("Cannot auto-generate bets for a user who is not a monkey");
        }
        Group::all()->each(function($group){
            $type = BetTypes::GroupsRank;
            $type_id = $group->getID();
            $data = $group->generateRandomBetData();
            $this->autoGenerateBet($type, $type_id, $data);
        });
        Match::all()->each(function($match){
            $type = BetTypes::Match;
            $type_id = $match->getID();
            $data = $match->generateRandomBetData();
            $this->autoGenerateBet($type, $type_id, $data);
        });
        SpecialBet::all()->each(function($specialBet){
            $type = BetTypes::SpecialBet;
            $type_id = $specialBet->getID();
            $data = $specialBet->generateRandomBetData();
            $this->autoGenerateBet($type, $type_id, $data);
        });
    }

    public function autoBetNewMatches(){
        if (!$this->isMonkey()){
            throw new \InvalidArgumentException("Cannot auto-generate bets for a user who is not a monkey");
        }
        $ids_with_bet = $this->bets()->where('type', BetTypes::Match)->pluck('type_id');
        Match::whereNotIn('id', $ids_with_bet)->get()->each(function($match){
            $type = BetTypes::Match;
            $type_id = $match->getID();
            $data = $match->generateRandomBetData();
            $this->autoGenerateBet($type, $type_id, $data);
        });
    }

    public function sendNotifications($title, $body){
        if (!$this->fcm_token) {
            return;
        }
        /** @var FcmClient $client */
        $client = app('FcmClient');
        $req = (new \Fcm\Push\Notification())
            ->setTitle($title)
            ->setBody($body)
            ->addRecipient($this->fcm_token);

        return $client->send($req);
    }
}
