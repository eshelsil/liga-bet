<?php

namespace App;

use App\Bets\BetableInterface;
use App\Bets\BetMatch\BetMatchRequest;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Exceptions\JsonException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

/**
 * Class Match
 * @package App
 */

/**
 * App\Match
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @property-read mixed $is_done
 * @method static Builder|Match isDone($isDone)
 * @method static Builder|Match newModelQuery()
 * @method static Builder|Match newQuery()
 * @method static Builder|Match query()
 * @method static Builder|Match whereCompetitionId($value)
 * @method static Builder|Match whereCreatedAt($value)
 * @method static Builder|Match whereExternalId($value)
 * @method static Builder|Match whereId($value)
 * @method static Builder|Match whereKoWinner($value)
 * @method static Builder|Match whereResultAway($value)
 * @method static Builder|Match whereResultHome($value)
 * @method static Builder|Match whereScore($value)
 * @method static Builder|Match whereStartTime($value)
 * @method static Builder|Match whereSubType($value)
 * @method static Builder|Match whereTeamAwayId($value)
 * @method static Builder|Match whereTeamHomeId($value)
 * @method static Builder|Match whereType($value)
 * @method static Builder|Match whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Match extends Model implements BetableInterface
{

protected static $groupStageGames = null;
protected static $knockoutGames = null;
protected static $theFinal = null;

    protected $scores = [
        "group_stage" => [
            "1X2" => 1,
            "score" => 2
        ],
        "knockout" => [
            "winner" => 2,
            "1X2" => 1,
            "score" => 6
        ]
    ];

    /** @var Team $teamHome */
    protected $teamHome = null;
    /** @var Team $teamAway */
    protected $teamAway = null;

    public function isKnockout()
    {
        return $this->type == "knockout";
    }

    public function getScore($type)
    {
        $scorePath = $this->type;
        return array_get($this->scores, "{$scorePath}.{$type}");
    }

    public function decompleteBets(){
        foreach ($this->getBets() as $bet) {
            $bet->score = null;
            $bet->save();
            echo "User: {$bet->user->name} | Score: null<br><br>";
        }
    }

    public function completeBets($scoreHome = null, $scoreAway = null, $isAwayWinner = null)
    {
        if (!is_null($scoreHome) && !is_null($scoreAway)) {
            if ($this->isKnockout()){
                if ($scoreHome > $scoreAway){
                    $this->ko_winner = $this->team_home_id;
                } else if ($scoreHome < $scoreAway){
                    $this->ko_winner = $this->team_away_id;
                } else if ($isAwayWinner) {
                    $this->ko_winner = $this->team_away_id;
                } else {
                    $this->ko_winner = $this->team_home_id;
                }
            }
            $this->result_home = $scoreHome;
            $this->result_away = $scoreAway;
            $this->save();
        }


        echo "Match Home ({$this->getTeamHome()->name}): {$this->result_home} | Away ({$this->getTeamAway()->name}): {$this->result_away}<br><br>";

        Log::debug("Creating result");
        $result = new BetMatchRequest($this, [
            "result-home" => "{$this->result_home}",
            "result-away" => "{$this->result_away}",
            "winner_side" => "{$this->getKnockoutWinnerSide()}",
        ]);
        Log::debug("REsult: {$result->toJson()}");
        /** @var Bet $bet */
        foreach ($this->getBets() as $bet) {
            $betRequest = new BetMatchRequest($this, [
                "result-home" => $bet->getData("result-home"),
                "result-away" => $bet->getData("result-away"),
                "winner_side" => $bet->getData("ko_winner_side"),
            ]);
            $bet->score = $betRequest->calculate($result);
            $bet->save();

            echo "User: {$bet->user->name} Bet home: {$bet->getData("result-home")} Bet away: {$bet->getData("result-away")} Score: {$bet->score}<br><br>";
        }

        return "FINISHED";

    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getBets()
    {
        $MatchBets = Bet::query()->where("type", BetTypes::Match)
                       ->where("type_id", $this->id)
                       ->with("user")
                       ->get();
        return $MatchBets;
    }

    /**
     * @return Team
     */
    public function getTeamHome()
    {
        if (!$this->teamHome) { 
            $this->teamHome = Team::query()->where('external_id', $this->team_home_id)
            ->get()->first();
        }
        return $this->teamHome;
    }

    /**
     * @return Team
     */
    public function getTeamAway()
    {
        if (!$this->teamAway) {
            $this->teamAway= Team::query()->where('external_id', $this->team_away_id)
            ->get()->first();
        }
        return $this->teamAway;
    }

    public function isClosedToBets()
    {
        return $this->start_time < time() + config("bets.lockBeforeSeconds");
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
        if ($winner_id == $this->team_home_id){
            return "home";
        }
        return "away";
    }

    public function getKnockoutWinner()
    {
        return $this->ko_winner;
    }

    public function getKnockoutLoser()
    {
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

    public function getIsDoneAttribute()
    {
        return !is_null($this->attributes["result_home"]) &&
               !is_null($this->attributes["result_away"]);
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeIsDone($query, $isDone)
    {
        return $query->when($isDone, function (Builder $b) {
                $b->whereNotNull("result_home")
                  ->whereNotNull("result_away");
            },  function (Builder $b) {
                $b->whereNull("result_home")
                  ->whereNull("result_away");
            });
    }

    public static function getFinalMatch()
    {
        if (static::$theFinal){
            return static::$theFinal;
        }
        return static::$theFinal = Match::where('type', 'knockout')
            ->where('sub_type', 'FINAL')
            ->first();
    }
    
    public static function getFinalMatchIfDone()
    {
        $final = static::getFinalMatch();
        if (is_null($final) || !$final->is_done){
            return null;
        }
        return $final;
    }

    public function getID()
    {
        return $this->id;
    }

    public static function hasOneWaitingForResult()
    {
        return Match::where('start_time', '<', time() - (60 * 90))
                ->isDone(false)
                ->exists();
    }

    public static function getGroupStageGames(){
        if (static::$groupStageGames){
            return static::$groupStageGames;
        }
        return static::$groupStageGames = Match::query()->isDone(true)
            ->where('type', 'group_stage')->get();
    }
    
    public static function getGroupStageGamesIfStageDone(){
        $games = static::getGroupStageGames();
        
        if ($games->count() < config('tournamentData.groupStageGamesCount')){
            return null;
        };
        return $games;
    }

    public static function getKnockoutGames(){
        if (static::$knockoutGames){
            return static::$knockoutGames;
        }
        return static::$knockoutGames = Match::query()->isDone(true)
            ->where('type', 'knockout')->get();
    }

    public static function isGroupStageDone(){
        return Match::getGroupStageGamesIfStageDone() !== null;
    }
    
    public static function isTournamentDone(){
        $final_match = Match::getFinalMatchIfDone();
        return !!$final_match;
    }

    public static function getTeamKnockoutGames($team_id){
        return static::getKnockoutGames()->filter(function($match) use($team_id){
            return in_array($team_id, [$match->team_home_id, $match->team_away_id]);
        });
    }

    public function generateRandomBetData()
    {
        $res = [];
        foreach(['result-home', 'result-away'] as $key){
            $goals = Arr::random([0,1]);
            if ($goals == 1){
                $goals = Arr::random([1,2]);
            }
            if ($goals == 2){
                $goals = Arr::random([2,3]);
            }
            $res[$key] = "{$goals}";
        }
        if($this->isKnockout() && $res['result-home'] == $res['result-away']){
            $res['ko_winner_side'] = Arr::random(['home','away']);
        }
        return json_encode($res);
    }

}
