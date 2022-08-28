<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\TournamentUser
 *
 * @property int $id
 * @property int $user_id
 * @property int $tournament_id
 * @property string $role
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Tournament|null $tournament
 * @property-read \App\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUserId($value)
 * @mixin \Eloquent
 */
class TournamentUser extends Model
{
    protected $table = 'user_tournament_links';

    protected static $unguarded = true;

    const ROLE_ADMIN = 'admin';
    const ROLE_MANAGER = 'manager';
    const ROLE_CONTESTANT = 'contestant';
    const ROLE_NOT_CONFIRMED = 'not_confirmed';
    const ROLE_MONKEY = 'monkey';

    static function permissions(string $role)
    {
        if ($role == self::ROLE_ADMIN){
            return 3;
        } else if ($role == self::ROLE_MANAGER) {
            return 2;
        } else if ($role == self::ROLE_CONTESTANT) {
            return 1;
        } else if ($role == self::ROLE_NOT_CONFIRMED) {
            return 0;
        } else if ($role == self::ROLE_MONKEY) {
            return -1;
        }
    }

    public function isAdmin()
    {
        return $this->role == self::ROLE_ADMIN;
    }

    public function isManager()
    {
        return $this->role == self::ROLE_MANAGER;
    }

    public function isContestant()
    {
        return $this->role == self::ROLE_CONTESTANT;
    }

    public function isNotConfirmed()
    {
        return $this->role == self::ROLE_NOT_CONFIRMED;
    }

    public function hasManagerPermissions()
    {
        return static::permissions($this->role) >= static::permissions(self::ROLE_MANAGER);
    }

    public function isConfirmed()
    {
        return static::permissions($this->role) > static::permissions(self::ROLE_NOT_CONFIRMED);
    }

    public function isMonkey()
    {
        return $this->role == self::ROLE_MONKEY;
    }

    public function isCompeting()
    {
        return $this->isConfirmed() || $this->isMonkey();
    }


    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bets(): HasMany
    {
        return $this->hasMany(Bet::class, "user_tournament_id");
    }
}
