<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\CurrentStanding
 *
 * Live (current) standings row for one team within one group, refreshed every update run from
 * 365scores. Distinct from Group::standings (the final-only JSON ordering set once a group ends).
 *
 * @property int $id
 * @property int $group_id
 * @property int $team_id
 * @property int $position
 * @property int $game_played
 * @property int $points
 * @property int $goals_for
 * @property int $goals_against
 * @property int $goals_diff
 * @property bool $is_eliminated
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Group $group
 * @property-read \App\Team $team
 */
class CurrentStanding extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_eliminated' => 'boolean',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
