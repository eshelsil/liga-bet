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
    static $most_goals = null;
    static $top_scorers = null;

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

    public static function findByExternalId($ext_id){
        return Scorer::where('external_id', $ext_id)->first();
    }

    public static function getNextNegaitveId(){
        return -1 - Scorer::where('external_id', '<', 0)->get()->count();
    }

    public static function getCustomPlayers(){
        return Scorer::where('external_id', '<', 0)->get();
    }

    public static function register_player($player_id, $player_name){
        $player = self::findByExternalId($player_id);
        if ($player){
            if ($player->name !== $player_name){
                throw new \InvalidArgumentException("Player has different name then passed 'name' attribute - \"{{$player_name}}\". "
                                                ."existing_player - id: \"{{$player_id}}\"  |  name: \"{{$player->name}}\"");
            }
            return;
        }
        $scorer = new Scorer();
        $scorer->external_id = $player_id;
        $scorer->name = $player_name;
        $scorer->goals = 0;
        $scorer->save();
    }
}
