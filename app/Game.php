<?php

namespace App;

use App\Bets\BetableInterface;
use App\Bets\BetMatch\BetMatchRequest;
use App\Enums\BetTypes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $competition_id
 * @property-read \App\Competition|null $competition
 * @property-read mixed $is_done
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

protected static $groupStageGames = null;
protected static $knockoutGames = null;
protected static $theFinal = null;
protected $table = 'matches';

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
        /** @var Bet $bet */
        foreach ($this->getBets() as $bet) {
            $bet->score = null;
            $bet->save();
            echo "User: {$bet->utl->user->name} | Score: null<br><br>";
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


        Log::debug("Game Home ({$this->teamHome->name}): {$this->result_home} | Away ({$this->teamAway->name}): {$this->result_away}");

        Log::debug("Creating result");
        $result = new BetMatchRequest($this, [
            "result-home" => $this->result_home,
            "result-away" => $this->result_away,
            "winner_side" => $this->getKnockoutWinnerSide(),
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

            echo "User: {$bet->utl->user->name} Bet home: {$bet->getData("result-home")} Bet away: {$bet->getData("result-away")} Score: {$bet->score}<br><br>";
        }

        return "FINISHED";

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

    public static function getGroupStageGames(){
        if (static::$groupStageGames){
            return static::$groupStageGames;
        }
        return static::$groupStageGames = Game::query()->isDone(true)
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
        return static::$knockoutGames = Game::query()->isDone(true)
            ->where('type', 'knockout')->get();
    }

    public static function isGroupStageDone(){
        return Game::getGroupStageGamesIfStageDone() !== null;
    }
    
    public static function isTournamentDone() {
        $final_match = Game::getFinalMatchIfDone();
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
