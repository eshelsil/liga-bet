<?php

namespace App;

use App\Bets\BetableInterface;
use App\Bets\BetMatch\BetMatchRequest;
use App\Enums\BetTypes;
use App\Enums\GameSubTypes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

/**
 * Class Game
 * @package App
 */

/**
 * App\Game
 *
 * @property int $id
 * @property string|null $external_id
 * @property string $type
 * @property string $sub_type
 * @property int $team_home_id
 * @property int $team_away_id
 * @property int|null $start_time
 * @property int|null $result_home
 * @property int|null $result_away
 * @property int|null $score
 * @property int|null $ko_winner
 * @property bool $is_done
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @property-read \App\Competition|null $competition
 * @property-read \App\Team|null $teamAway
 * @property-read \App\Team|null $teamHome
 * @method static Builder|Game isDone($isDone)
 * @method static Builder|Game newModelQuery()
 * @method static Builder|Game newQuery()
 * @method static Builder|Game query()
 * @method static Builder|Game whereCompetitionId($value)
 * @method static Builder|Game whereCreatedAt($value)
 * @method static Builder|Game whereExternalId($value)
 * @method static Builder|Game whereId($value)
 * @method static Builder|Game whereKoWinner($value)
 * @method static Builder|Game whereResultAway($value)
 * @method static Builder|Game whereResultHome($value)
 * @method static Builder|Game whereScore($value)
 * @method static Builder|Game whereStartTime($value)
 * @method static Builder|Game whereSubType($value)
 * @method static Builder|Game whereTeamAwayId($value)
 * @method static Builder|Game whereTeamHomeId($value)
 * @method static Builder|Game whereType($value)
 * @method static Builder|Game whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Game extends Model implements BetableInterface
{
    protected $table = 'matches';

    const TYPE_KNOCKOUT = 'knockout';
    const TYPE_GROUP_STAGE = 'group_stage';
    const LEG_TYPE_FIRST = 'first';
    const LEG_TYPE_SECOND = 'second';

    public function isTwoLeggedTie()
    {
        if (!$this->isKnockout()){
            return false;
        }
        if ($this->competition->getCompetitionType() == Competition::TYPE_UCL){
            if ($this->isTheFinal()){
                return false;
            }
            return true;
        }
        return false;
    }

    public function isLastLeg()
    {
        if (!$this->isTwoLeggedTie()){
            return true;
        }
        return $this->ko_leg == self::LEG_TYPE_SECOND;
    }

    public function isFirstLeg()
    {
        if (!$this->isTwoLeggedTie()){
            return true;
        }
        return $this->ko_leg == self::LEG_TYPE_FIRST;
    }

    public function getOtherLegGame()
    {
        if (!$this->isTwoLeggedTie()){
            return null;
        }
        return $this->competition->games->first(fn(Game $g) =>
            $g->isTwoLeggedTie() && $g->stage == $this->stage && $g->subType == $this->subType
            && collect([$g->team_home_id, $g->team_away_id])->sort()->values()->toJson() == collect([$this->team_home_id, $this->team_away_id])->sort()->values()->toJson()
            && $g->id != $this->id
        );
    }

    public function isKnockout()
    {
        return $this->type == "knockout";
    }

    public function isGroupStage()
    {
        return $this->type == "group_stage";
    }

    public function decompleteBets(){
        /** @var Bet $bet */
        foreach ($this->getBets() as $bet) {
            $bet->score = null;
            $bet->save();
            echo "User: {$bet->utl->user->name} | Score: null<br><br>";
        }
    }

    /**
     * @return Collection
     */
    public function getBets(): Collection
    {
        /** @var Collection $bets */
        $bets = Bet::query()->where("type", BetTypes::Game)
                       ->where("type_id", $this->id)
                       ->with("utl.user")
                       ->get();
        return $bets;
    }

    public function isOpenForBets()
    {
        return $this->start_time > time() + config("bets.lockBeforeSeconds");
    }

    public function teamHome(): BelongsTo
    {
        return $this->belongsTo(Team::class, "team_home_id");
    }

    public function teamAway(): BelongsTo
    {
        return $this->belongsTo(Team::class, "team_away_id");
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class, "competition_id");
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'sub_type', 'external_id')
                ->where('competition_id', $this->competition_id);
    }
    
    public function scorers()
    {
        return $this->hasMany(GameDataGoal::class);
    }

    public function isClosedForBets()
    {
        return $this->start_time < time() + config("bets.lockBeforeSeconds");
    }

    public function hasStarted()
    {
        return $this->start_time < time();
    }

    public function isLive()
    {
        return ($this->start_time < time()) && !$this->is_done;
    }

    public function getGoalsData()
    {
        return [
            $this->team_home_id => $this->result_home,
            $this->team_away_id => $this->result_away
        ];
    }

    public function getTeamIds()
    {
        return [
            $this->team_home_id,
            $this->team_away_id
        ];
    }

    public function getTeamIdByWinnerSide($winner_side){
        if ($winner_side == "home"){
           return $this->team_home_id;
        }
        if ($winner_side == "away"){
           return $this->team_away_id;
        }
        return null;
    }

    public function getTeamSide(int $teamId){
        if ($teamId == $this->team_home_id){
           return "home";
        }
        if ($teamId == $this->team_away_id){
           return "away";
        }
        return null;
    }

    public function getWinnerSide()
    {
        if (!$this->is_done){
            return null;
        }
        $result_home = $this->result_home;
        $result_away = $this->result_away;
        if ($result_home > $result_away){
            return "home";
        } else if ($result_home < $result_away){
            return "away";
        }
        if (!$this->isKnockout()){
            return null;
        }
        return $this->getKnockoutWinnerSide();
    }

    public function getKnockoutWinnerSide()
    {
        $winner_id = $this->getKnockoutWinner();
        if ($winner_id === null){
            return null;
        }
        if ($winner_id == $this->team_home_id) {
            return "home";
        }
        return "away";
    }

    public function getKnockoutWinner()
    {
        if (!$this->isLastLeg()){
            return null;
        }
        return $this->ko_winner;
    }

    public function getKnockoutLoser()
    {
        if (!$this->isLastLeg()){
            return null;
        }
        return array_values(array_diff($this->getTeamIds(), [$this->getKnockoutWinner()]))[0];
    }

    public function formatMatchResult($options = [])
    {
        $winner_class = $options['winner_class'] ?? '';
        $winner_side = $this->getWinnerSide();
        $result_home = $this->result_home;
        $result_away = $this->result_away;
        if ($winner_side === "home"){
            return $result_away.":<span class=\"{$winner_class}\">".$result_home."</span>";
        } else if ($winner_side === "away"){
            return "<span class=\"{$winner_class}\">".$result_away."</span>:".$result_home;
        }
        return $result_away.":".$result_home;
    }


    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeIsDone($query, $isDone)
    {
        return $query->where('is_done', $isDone);
    }


    public function getID()
    {
        return $this->id;
    }

    public static function hasOneWaitingForResult()
    {
        return Game::where('start_time', '<', time() - (60 * 90))
                ->isDone(false)
                ->exists();
    }

    public function isTheFinal() {
        return $this->isKnockout() && $this->sub_type == GameSubTypes::FINAL;
    }

    public function isTheLastGameOfGroupStage() {
        return $this->id == $this->competition->getLastGroupStageGameId();
    }

    public function isTheLastGameOnGroup() {
        return $this->competition->getIdsOfLastGroupGames()->contains($this->id);
    }

    public function generateRandomBetData(?bool $qualifierBetIsOn = true, $otherLegKoWinnerSide = null)
    {
        if ($this->competition->getCompetitionType() == Competition::TYPE_UCL){
            return $this->generateRandomBetDataUcl($qualifierBetIsOn, $otherLegKoWinnerSide);
        }
        $res = [];
        foreach(['result-home', 'result-away'] as $key){
            $goals = Arr::random([0,1]);
            if ($goals == 1){
                $goals = Arr::random([1,2]);
            }
            if ($goals == 2){
                $goals = Arr::random([2,3]);
            }
            $res[$key] = $goals;
        }
        if($this->isKnockout() && $res['result-home'] == $res['result-away'] && $qualifierBetIsOn){
            $res['ko_winner_side'] = Arr::random(['home','away']);
        }
        return json_encode($res);
    }

    public function generateRandomBetDataUcl(?bool $qualifierBetIsOn = true, $otherLegKoWinnerSide = null)
    {
        $res = [];
        $max = 4;
        foreach(['result-home', 'result-away'] as $key){
            $goals = 0;
            for ($i = 0; $i < $max; $i++) {
                $choice = Arr::random([0,1]);
                if ($choice == 0){
                    break;
                } else {
                    $goals++;
                }
            }
            $res[$key] = $goals;
        }

        if($this->isKnockout() && $qualifierBetIsOn){
            if ($otherLegKoWinnerSide === null){
                $res['ko_winner_side'] = Arr::random(['home','away']);
            } else {
                $res['ko_winner_side'] = $otherLegKoWinnerSide;
            }
        }
        return json_encode($res);
    }

}
