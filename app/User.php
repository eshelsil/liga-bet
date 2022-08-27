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
 * @property int $id
 * @property string $name
 * @property string $username
 * @property string $password
 * @property int $permissions
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $fcm_token
 * @property-read Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection|\App\Tournament[] $ownedTournaments
 * @property-read int|null $owned_tournaments_count
 * @property-read Collection|\App\Tournament[] $tournaments
 * @property-read int|null $tournaments_count
 * @property-read Collection|\App\TournamentUser[] $utls
 * @property-read int|null $utls_count
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFcmToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePermissions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 * @mixin \Eloquent
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
    const TYPE_TOURNAMENT_ADMIN = 1;
    const TYPE_USER = 0;
    const TYPE_MONKEY = -1;

    public function isAdmin()
    {
        return $this->permissions == self::TYPE_ADMIN;
    }

    public function isTournamentAdmin()
    {
        return $this->permissions == self::TYPE_TOURNAMENT_ADMIN;
    }

    public function isConfirmed(int $tournamentId)
    {
        $utl = $this->getTournamentUser($tournamentId);
        if (!$utl) return false;
        return $utl->isConfirmed();
    }

    public function isMonkey()
    {
        return $this->permissions == self::TYPE_MONKEY;
    }

    public function bets()
    {
        return $this->hasMany('App\Bet');
    }

    public function tournaments(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Tournament::class, (new TournamentUser)->getTable());
    }

    public function ownedTournaments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Tournament::class, 'creator_user_id');
    }

    public function utls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TournamentUser::class);
    }

    public function getManagedTouranemnts()
    {
        return $this->utls->filter(fn($utl) => $utl->isTournamentAdmin())
                          ->map(fn($utl) => $utl->tournament);
    }

    public function getGroupBetsById() {
        $groups = Group::all();
        $bets = Bet::query()
            ->where("type", BetTypes::GroupsRank)
            ->where("user_id", $this->id)
            ->get();
        $output = [];
        foreach ($groups as $group) {
            $group->bet = $bets->firstWhere("type_id", $group->id);
            $group->teamsById = $group->teams->keyBy("id");
            $output[$group->id] = $group;
        }
        return $output;
    }

    public function getTournamentUser($tournamentId): ?TournamentUser
    {
        return $this->utls->firstWhere("tournament_id", $tournamentId);
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
