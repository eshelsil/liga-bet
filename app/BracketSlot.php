<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\BracketSlot
 *
 * One participant slot of a bracket tie (slot_num 1 = home, 2 = away). Holds the *source* of the
 * slot — either a group standings position (first KO round) or the winner/loser of a prior tie —
 * plus the resolved references (group / feeding tie / team) once the data is available.
 *
 * @property int $id
 * @property int $bracket_game_id
 * @property int $slot_num
 * @property string $kind            group_position | match_winner | match_loser
 * @property int|null $origin_stage_num
 * @property int|null $origin_group_num
 * @property int|null $origin_position
 * @property string|null $symbolic_name
 * @property string|null $allowed_groups
 * @property int|null $group_id
 * @property int|null $feeds_from_game_id
 * @property int|null $team_id
 * @property-read \App\BracketGame $bracketGame
 * @property-read \App\Group|null $group
 * @property-read \App\BracketGame|null $feedsFromGame
 * @property-read \App\Team|null $team
 */
class BracketSlot extends Model
{
    public const KIND_GROUP_POSITION = 'group_position';
    public const KIND_MATCH_WINNER   = 'match_winner';
    public const KIND_MATCH_LOSER    = 'match_loser';

    protected $guarded = [];

    public function bracketGame(): BelongsTo
    {
        return $this->belongsTo(BracketGame::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function feedsFromGame(): BelongsTo
    {
        return $this->belongsTo(BracketGame::class, 'feeds_from_game_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
