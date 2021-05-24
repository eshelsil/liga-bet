<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Bet;
use App\Match;
use App\Enums\BetTypes;
use App\Bets\BetableInterface;
use App\Bets\BetGroupRank\BetGroupRankRequest;


class Group extends Model implements BetableInterface
{
    //
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

    private function getStandings(){
        return collect(json_decode($this->standings))->groupBy('position')->map(function($rows){
            return $rows->first()->team_id;
        })->toArray();
    }

    public function getID()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getGroupTeamsById()
    {
        return Team::all()->where('group_id', $this->external_id)->groupBy('id')->map(function($arr){
            return $arr->first();
        });
    }

    public function calculateBets(){
        $bets = Bet::query()
            ->where("type", BetTypes::GroupsRank)
            ->where("type_id", $this->id)
            ->get();
        echo "FINAL RANKS: $this->standings<br><br>";
        $finalStandings = $this->getStandings();
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetGroupRankRequest($this, (array)$bet->getData());
                $bet->score = $betRequest->calculate($finalStandings);
                $bet->save();
                echo "USER {$bet->user_id} Score ({$bet->score}) RANKS: {$betRequest->toJson()}<br>";
            } catch (Exception $exception) {
                return $exception->getMessage();
                continue 1;
            }
        }
        echo "completed";
    }

    public static function areBetsOpen(){
        $first_match_start_time = Match::min('start_time');
        $lock_before_secs = config('bets.lockBetsBeforeTournamentSeconds');
        return $first_match_start_time - $lock_before_secs > time();
    }
}