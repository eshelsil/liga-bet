<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\BracketGame
 *
 * One knockout tie of a bracket, sourced from 365scores /brackets. Distinct from App\Game
 * (the playable `matches` row): a bracket_game describes the bracket *topology* (round, side,
 * who feeds whom, which group/position fills each slot) and links to a Game once it exists.
 *
 * @property int $id
 * @property int $competition_id
 * @property int $stage_num
 * @property int $group_num
 * @property string $sub_type
 * @property string|null $match_label
 * @property string|null $side
 * @property int|null $start_time
 * @property string|null $external_id
 * @property int|null $game_id
 * @property int|null $dest_stage_num
 * @property int|null $dest_group_num
 * @property-read \App\Competition|null $competition
 * @property-read \App\Game|null $game
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\BracketSlot[] $slots
 */
class BracketGame extends Model
{
    protected $guarded = [];

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function slots(): HasMany
    {
        return $this->hasMany(BracketSlot::class);
    }

    public function homeSlot(): ?BracketSlot
    {
        return $this->slots->firstWhere('slot_num', 1);
    }

    public function awaySlot(): ?BracketSlot
    {
        return $this->slots->firstWhere('slot_num', 2);
    }

    /** The tie whose winner advances into this one's dest slot (null for Final / 3rd place). */
    public function feedsInto(): ?BracketGame
    {
        if (is_null($this->dest_stage_num)) {
            return null;
        }
        return static::query()
            ->where('competition_id', $this->competition_id)
            ->where('stage_num', $this->dest_stage_num)
            ->where('group_num', $this->dest_group_num)
            ->first();
    }
}
