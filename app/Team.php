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
        return Team::all(['external_id', 'id'])->mapWithKeys(function(Team $team){
            return [$team->external_id => $team->id];
        });
    }
}
