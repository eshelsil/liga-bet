<?php

namespace App;

use App\Match;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Scorer
 * @property int id
 * @property int external_id
 * @property string name
 * @property int goals
 */
class Scorer extends Model
{
    public static function getTopScorers(){
        $most_goals = Scorer::getTopGoalsCount();
        if ($most_goals = null){
            return null;
        }
        $top_scorers = Scorer::where('goals', $most_goals);
        return $top_scorers;
    }

    public static function getTopGoalsCount(){
        if (!Match::isTournamentDone()){
            return null;
        }
        return Scorer::max('goals');
    }

    public static function findByExternalId($ext_id){
        return Scorer::where('external_id', $ext_id)->first();
    }

    public static function getNextNegaitveId(){
        return -1 - Scorer::where('external_id', '<', 0)->get()->count();
    }

    public static function getCustomPlayers(){
        return Scorer::where('external_id', '<', 0)->get();
    }
}
