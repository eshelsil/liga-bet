<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Team
 * @property int id
 * @property int external_id
 * @property int group_id
 * @property string name
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
