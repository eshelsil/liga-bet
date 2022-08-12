<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\LeaderboardsVersion
 *
 * @property int $id
 * @property int $tournament_id
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Leaderboard[] $leaderboards
 * @property-read int|null $leaderboards_count
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion query()
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeaderboardsVersion whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class LeaderboardsVersion extends Model
{
    use HasFactory;

    public function leaderboards(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Leaderboard::class, "version_id");
    }
}
