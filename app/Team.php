<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Team
 *
 * @property int $id
 * @property string|null $external_id
 * @property string $name
 * @property string $crest_url
 * @property int $group_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @property-read Collection|\App\Player[] $players
 * @property-read int|null $players_count
 * @property-read \App\Competition|null $competition
 * @method static \Illuminate\Database\Eloquent\Builder|Team newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Team newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Team query()
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereCrestUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Team whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Team extends Model
{
    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class, "competition_id");
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }
}
