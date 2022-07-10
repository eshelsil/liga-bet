<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Team
 *
 * @property int $id
 * @property string|null $external_id
 * @property string $name
 * @property string $crest_url
 * @property string $group_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
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
    public static function getExternalIdToIdMap(){
        return Team::all(['external_id', 'id'])->keyBy('external_id');
    }

    public static function getTeamsById(){
        return Team::all()->keyBy('id');
    }

    public static function getTeamsByExternalId(){
        return Team::all()->keyBy('external_id');
    }
}
