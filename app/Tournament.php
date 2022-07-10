<?php

namespace App;

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
 * @property-read \App\Competition|null $competition
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
    /**
     * Get the phone record associated with the user.
     */
    public function competition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }
}
