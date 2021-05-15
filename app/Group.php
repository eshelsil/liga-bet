<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    //
    public function isComplete(){
        return !is_null($this->standings);
    }

    public function getTeamByPosition($position_case){
        $standings = $this->standings;
        foreach($standings as $position => $team_id){
            if ($position_case == $position){
                return $team_id;
            }
        }
    }
}
