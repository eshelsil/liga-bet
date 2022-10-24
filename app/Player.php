<?php

namespace App;

use App\Game;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Validator;

/**
 * Class Scorer
 *
 * @property int $id
 * @property string $external_id
 * @property string $name
 * @property int $team_id
 * @property int|null $shirt
 * @property string|null $position
 * @property int $goals
 * @property int $assists
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Team|null $team
 * @method static \Illuminate\Database\Eloquent\Builder|Player newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Player newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Player query()
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereAssists($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereGoals($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereShirt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Player whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Player extends Model
{
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public static function generate(Team $team, \App\DataCrawler\Player $playerData)
    {
        $player = new Player();
        $player->external_id = $playerData->externalId;
        $player->name = $playerData->name;
        $player->team()->associate($team);
        $player->shirt = $playerData->shirt;
        $player->goals = 0;
        $player->assists = 0;
        $player->save();

        return $player;
    }
}
