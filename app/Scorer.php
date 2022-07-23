<?php

namespace App;

use App\Game;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;

/**
 * Class Scorer
 *
 * @property int $id
 * @property string $external_id
 * @property string $name
 * @property string $team_id
 * @property int $goals
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereGoals($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scorer whereUpdatedAt($value)
 * @mixin \Eloquent
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
        if ($most_goals == null){
            return null;
        }
        return static::$top_scorers = Scorer::where('goals', $most_goals)->get();
    }

    public static function getTopGoalsCount(){
        if (!Game::isTournamentDone()){
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

    public static function generate(Competition $competition, $playerData)
    {
        Validator::make($playerData, [
            'name' => 'required|string|min:4',
            'external_id' => 'required|integer',
            'team_id' => 'required|integer',
        ]);
        $scorer = new Scorer();
        $scorer->competition_id = $competition->id;
        $scorer->external_id = $playerData['external_id'];
        $scorer->name = $playerData['name'];
        $scorer->team_id = $playerData['team_id'];
        $scorer->goals = 0;
        $scorer->save();
    }
}
