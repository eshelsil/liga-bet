<?php

namespace App;

use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Model;


/**
 * App\Tournament
 *
 * @property int $id
 * @property int $competition_id
 * @property string $name
 * @property array $config
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $creator_user_id
 * @property string $code
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Competition|null $competition
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\LeaderboardsVersion[] $leaderboardVersions
 * @property-read int|null $leaderboard_versions_count
 * @property-read \App\LeaderboardsVersion|null $leaderboardVersionsLatest
 * @property-read \Illuminate\Database\Eloquent\Collection|SpecialBet[] $specialBets
 * @property-read int|null $special_bets_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\TournamentUser[] $utls
 * @property-read int|null $utls_count
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCreatorUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Tournament extends Model
{

    const STATUS_DONE = 'done';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_INITIAL = 'initial';

    protected $casts = [
        "config" => "array"
    ];

    protected static $unguarded = true;

    public function competition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function preferences(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(TournamentPreferences::class);
    }

    public function bets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Bet::class);
    }

    public function utls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TournamentUser::class);
    }

    public function specialBets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SpecialBet::class);
    }

    public function leaderboardVersions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LeaderboardsVersion::class);
    }

    public function leaderboardVersionsLatest(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(LeaderboardsVersion::class)->latestOfMany();
    }

    public function confirmedUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isConfirmed());
    }

    public function getUtlOfUser(User $user)
    {
        return $this->utls->firstWhere('user_id', $user->id);
    }

    public function shouldAutoConfirmNewUtls()
    {
        return $this->preferences->isAutoConfirmUtlsOn();
    }

    public function hasStarted()
    {
        return $this->status != static::STATUS_INITIAL;
    }

    public function hasValidScoreConfig()
    {
        return array_key_exists('scores', $this->config);
    }

    public function createUTL(User $user, string $name)
    {
        $role = TournamentUser::ROLE_NOT_CONFIRMED;
        if ($this->creator_user_id == $user->id){
            $role = TournamentUser::ROLE_ADMIN;
        } elseif ($user->isMonkey()){
            $role = TournamentUser::ROLE_MONKEY;
        } elseif ($this->shouldAutoConfirmNewUtls()) {
            $role = TournamentUser::ROLE_CONTESTANT;
        }

        return TournamentUser::create([
            'user_id' => $user->id,
            'tournament_id' => $this->id,
            'name' => $name,
            'role' => $role
        ]);
    }
}
