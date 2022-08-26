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
 * @property string $config
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Competition|null $competition
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\LeaderboardsVersion[] $leaderboardVersions
 * @property-read int|null $leaderboard_versions_count
 * @property-read \Illuminate\Database\Eloquent\Collection|SpecialBet[] $specialBets
 * @property-read int|null $special_bets_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\TournamentUser[] $utls
 * @property-read int|null $utls_count
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCreatedAt($value)
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

    public function competition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Competition::class);
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

    public function getUtlOfUser(User $user)
    {
        return $this->utls->where('user_id', $user->id)->first();
    }

    public function getCreatorUserId()
    {
        return $this->creator_user_id;
    }

    public function createUTL(User $user, string $name)
    {
        $role = TournamentUser::ROLE_NOT_CONFIRMED;
        if ($this->getCreatorUserId() == $user->id){
            $role = TournamentUser::ROLE_ADMIN;
        } else if ($user->isMonkey()){
            $role = TournamentUser::ROLE_MONKEY;
        }
        $utl = TournamentUser::create([
            'user_id' => $user->id,
            'tournament_id' => $this->id,
            'name' => $name,
            'role' => $role
        ]);
        return $utl;
    }
}
