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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Tournament|null $tournament
 * @property-read \App\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUserId($value)
 * @mixin \Eloquent
 */
class TournamentUser extends Model
{
    protected $table = 'user_tournament_links';

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
