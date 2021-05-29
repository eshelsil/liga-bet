<?php

namespace App;

use App\Match;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;

/**
 * Class Scorer
 * @property int id
 * @property int external_id
 * @property string name
 * @property int goals
 */
class Scorer extends Model
{
    static $most_goals = null;
    static $top_scorers = null;
    static $collection = null;

    public static function getTopScorers(){
        if (!is_null(static::$top_scorers)){
            return static::$top_scorers;
        }
        $most_goals = static::getTopGoalsCount();
        if ($most_goals = null){
            return null;
        }
        return static::$top_scorers = Scorer::where('goals', $most_goals)->get();
    }

    public static function getTopGoalsCount(){
        if (!Match::isTournamentDone()){
            return null;
        }
        if (!is_null(static::$most_goals)){
            return static::$most_goals;
        }
        return static::$most_goals = Scorer::max('goals');
    }

    public static function getAll(){
        if (static::$collection){
            return static::$collection;
        }
        return static::$collection = Scorer::all();
    }
    public static function findByExternalId($ext_id){
        $scorers = static::getAll();
        return $scorers->where('external_id', $ext_id)->first();
    }

    public static function register_players($playersArray){
        foreach($playersArray as $playerData){
            static::register_player($playerData);
        }
    }

    public static function register_player($playerData){
        Validator::make($playerData, [
            'name' => 'required|string|min:4',
            'external_id' => 'required|integer',
            'team_id' => 'required|integer',
        ]);
        $scorer = new Scorer();
        $scorer->external_id = $playerData['external_id'];
        $scorer->name = $playerData['name'];
        $scorer->team_id = $playerData['team_id'];
        $scorer->goals = 0;
        $scorer->save();
    }
}
