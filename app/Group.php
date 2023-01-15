<?php

namespace App;

use Exception;
use Illuminate\Database\Eloquent\Model;
use App\Bet;
use App\Game;
use App\Enums\BetTypes;
use App\Bets\BetableInterface;
use App\Bets\BetGroupsRank\BetGroupRankRequest;
use Illuminate\Support\Facades\Log;

/**
 * App\Group
 *
 * @property int $id
 * @property string $external_id
 * @property string $name
 * @property string|null $standings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @property-read \App\Competition|null $competition
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Team[] $teams
 * @property-read int|null $teams_count
 * @method static \Illuminate\Database\Eloquent\Builder|Group newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group query()
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereStandings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Group extends Model implements BetableInterface
{
    public function isComplete(){
        // return !is_null($this->standings);
        
        // Demo remove :
        
        $competition = Competition::find($this->competition_id);
        return !is_null($this->standings) && $competition->games()->where('sub_type', $this->external_id)->get()
            ->filter(fn($game) => $game->is_done)
            ->count() == 6;
    }

    public function getTeamIDByPosition($position_case){
        $standings = $this->getStandings();
        foreach($standings as $position => $team_id){
            if ($position_case == $position){
                return $team_id;
            }
        }
    }

    public function fartStandings(): array
    {
        return $this->teams
            ->pluck("id")
            ->shuffle()
            ->toArray();
    }

    public static function randomizeAllStandings(){
        foreach (static::all() as $group){
            $group->standings = json_encode($group->fartStandings());
            $group->save();
        }
    }

    public function getStandings(): array
    {
        return json_decode($this->standings, true);
    }

    public static function findByExternalId($ext_id): Group
    {
        return static::where('external_id', $ext_id)->first();
    }

    public function getID()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function competition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function calculateBets()
    {
        $tournaments = $this->competition->tournaments->keyBy("id");
        $bets = Bet::query()
            ->whereIn("tournament_id", $tournaments->keys())
            ->where("type", BetTypes::GroupsRank)
            ->where("type_id", $this->id)
            ->get();

        Log::debug("FINAL RANKS: $this->standings");
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetGroupRankRequest($this, $tournaments->get($bet->tournament_id), (array)$bet->getData());
                $bet->score = $betRequest->calculate();
                $bet->save();
            } catch (Exception $e) {
                Log::debug("[Group][calculateBets] Got error: {$e->getMessage()}");
                Log::debug("[Group][calculateBets] error traces: {$e->getTraceAsString()}");
            }
        }
    }



    public function generateRandomBetData(){
        $standings = $this->fartStandings();
        $res = [];
        foreach($standings as $teamId){
            $res[] = $teamId;
        }
        return json_encode($res);
    }
}