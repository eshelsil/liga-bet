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
    static $firstMatchStartTime = null;

    public function isComplete(){
        return !is_null($this->standings);
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
            ->map(fn($teamId, $index) => [
                "position" => $index + 1,
                "team_id" => $teamId,
            ])
            ->toArray();
    }

    public static function randomizeAllStandings(){
        foreach (static::all() as $group){
            $group->standings = json_encode($group->fartStandings());
            $group->save();
        }
    }

    private function getStandings(){
        return collect(json_decode($this->standings))->pluck('team_id', 'position')->toArray();
    }

    public static function findByExternalId($ext_id){
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

    public function getGroupTeamsById()
    {
        return static::getTeamsCollection()->where('group_id', $this->external_id)->groupBy('id')->map(function($arr){
            return $arr->first();
        });
    }

    public function calculateBets()
    {
        $bets = Bet::query()
            ->whereIn("tournament_id", $this->competition->tournaments->modelKeys())
            ->where("type", BetTypes::GroupsRank)
            ->where("type_id", $this->id)
            ->get();

        Log::debug("FINAL RANKS: $this->standings");
        $finalStandings = $this->getStandings();
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetGroupRankRequest($this, (array)$bet->getData());
                $bet->score = $betRequest->calculate($finalStandings);
                $bet->save();
                Log::debug("USER {$bet->user_id} Score ({$bet->score}) RANKS: {$betRequest->toJson()}");
            } catch (Exception $exception) {
                return $exception->getMessage();
            }
        }
        echo "completed";
    }



    public function generateRandomBetData(){
        $standings = $this->fartStandings();
        $res = [];
        foreach($standings as $data){
            $res[$data['position']] = $data['team_id'];
        }
        return json_encode($res);
    }
}