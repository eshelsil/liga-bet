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
        return Team::all(['external_id', 'id'])->groupBy('external_id')->map(function($t){
            return $t->first()->id;
        });
    }

    public static function getTeamsById(){
        return Team::all()->groupBy('id')->map(function($t){
            return $t->first();
        });
    }

    public static function getTeamsByExternalId(){
        return Team::all()->groupBy('external_id')->map(function($t){
            return $t->first();
        });
    }
}
