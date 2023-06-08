<?php

namespace App;

use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use Carbon\Carbon;
use Fcm\FcmClient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Log;

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
        'email', 'password', 'permissions', 'can_edit_score_config'
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

    static function clearTests(){
        $t = Carbon::createFromFormat('Y-m-d H', '2023-05-17 17');
        $competition = Competition::first();
        SpecialBet::where('created_at', '>', $t)->delete();
        Bet::where('created_at', '>', $t)->delete();
        User::where('created_at', '>', $t)->delete();
        TournamentUser::where('created_at', '>', $t)->delete();
        Tournament::where('created_at', '>', $t)->delete();
        LeaderboardsVersion::where('created_at', '>', $t)->delete();
        Leaderboard::where('created_at', '>', $t)->delete();
        $competition->games()->update(['is_done' => false]);
    }

    static function getAllFinalScores(){
        $t = Carbon::createFromFormat('Y-m-d H', '2023-05-17 17');
        // $competition = Competition::find(1);
        $utls = collect([]);
        Tournament::all()->each(function(Tournament $t) use($utls){
            if($t->id != 2021){
                return;
            }
            $lastGameId = $t->competition->getSortedGameIds()->last();
            $version = $t->leaderboardVersions()->firstWhere('game_id', $lastGameId);
            $newData = $version->leaderboards->sortByDesc('score')->map(fn($l) => ["user_tournament_id" => $l->user_tournament_id, "total_score" => $l->score]);
            $newData->each(function($d) use($utls){
                $utls->push($d);
            });
        });
        return json_encode($utls->sortBy('user_tournament_id')->values());
    }

    static function getTest(){
        $rows = collect([]);
        foreach(Tournament::all() as $t){
            $versions = $t->competition->getSortedGameIds()->map(fn($gameId) => $t->leaderboardVersions->firstWhere('game_id', $gameId))->filter()->values();
            foreach($versions as $v){
                $rows = $rows->concat($v->leaderboards->sortBy('user_tournament_id')->map(fn($l) => ["$l->user_tournament_id" => $l->score]));
            };
            Log::debug("Count rows: ".$rows->count());
            // Log::debug("row example: ".json_encode($rows));
        }
        // dd($rows);
        return json_encode($rows->values());
    }

    public function isAdmin()
    {
        return $this->permissions == self::TYPE_ADMIN;
    }

    public function isTournamentAdmin()
    {
        return $this->permissions == self::TYPE_TOURNAMENT_ADMIN;
    }

    public function hasTournamentAdminPermissions()
    {
        return $this->permissions >= self::TYPE_TOURNAMENT_ADMIN;
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

    public function registeredUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isRegistered());
    }

    public function wasAnActiveUser()
    {
        foreach($this->utls as $utl){
            if ($utl->wasAnActiveUser()){
                return true;
            }
        }
        return false;
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
