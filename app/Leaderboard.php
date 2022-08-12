<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Leaderboard
 *
 * @property int $id
 * @property int $user_tournament_id
 * @property int $tournament_id
 * @property int $version_id
 * @property int $rank
 * @property int $score
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard query()
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereRank($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereUserTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Leaderboard whereVersionId($value)
 * @mixin \Eloquent
 */
class Leaderboard extends Model
{
    use HasFactory;
}
