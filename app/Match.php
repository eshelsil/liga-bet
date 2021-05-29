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

/**
 * Class Match
 * @package App
 */

/**
 * @property int $external_id
 * @property int $type
 * @property int $sub_type
 * @property int $team_home_id
 * @property int $team_away_id
 * @property int $start_time
 * @property int $result_home
 * @property int $result_away
 * @property int $score
 * @property bool $is_done
 */
class Match extends Model implements BetableInterface
{

protected static $groupStageGames = null;
protected static $knockoutGames = null;
protected static $theFinal = null;

    protected $scores = [
        "group_stage" => [
            "winner" => 1,
            "score" => 2
        ],
        "knockout" => [
            "winner" => 3,
            "score" => 6
        ]
    ];

    /** @var Team $teamHome */
    protected $teamHome = null;
    /** @var Team $teamAway */
    protected $teamAway = null;

    public function getScore($type)
    {
        $scorePath = $this->type;
        return array_get($this->scores, "{$scorePath}.{$type}");
    }

    private function getCrawlerMatch()
    {
        $crawler = Crawler::getInstance();
        $crawlerSubType = Collection::make($crawler->getData("{$this->type}.{$this->sub_type}.matches"));
        $crawlerMatch = $crawlerSubType->first(function ($match) { return $match->name == $this->external_id; });
        return $crawlerMatch;
    }

    public function decompleteBets($scoreHome = null, $scoreAway = null){
        foreach ($this->getBets() as $bet) {
            $bet->score = null;
            $bet->save();
            echo "User: {$bet->user->name} Bet home: Score: null<br><br>";
        }
    }

    public function completeBets($scoreHome = null, $scoreAway = null)
    {
        if (!is_null($scoreHome) && !is_null($scoreAway)) {
            $this->result_home = $scoreHome;
            $this->result_away = $scoreAway;
            $this->save();
        }


        echo "Match Home ({$this->getTeamHome()->name}): {$this->result_home} | Away ({$this->getTeamAway()->name}): {$this->result_away}<br><br>";

        Log::debug("Creating result");
        $result = new BetMatchRequest($this, [
            "result-home" => "{$this->result_home}",
            "result-away" => "{$this->result_away}",
        ]);
        Log::debug("REsult: {$result->toJson()}");
        /** @var Bet $bet */
        foreach ($this->getBets() as $bet) {
            $betRequest = new BetMatchRequest($this, [
                "result-home" => $bet->getData("result-home"),
                "result-away" => $bet->getData("result-away"),
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

    public function getKnockoutWinner()
    {
        return $this->ko_winner;
    }

    public function getKnockoutLoser()
    {
        return array_diff($this->getTeamIds(), [$this->getKnockoutWinner()])[0];
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
            ->get();
    }
    
    public static function getFinalMatchIfDone()
    {
        $final = static::getFinalMatch();
        static::$theFinal = Match::where('type', 'knockout')
            ->where('sub_type', 'FINAL')
            ->isDone(true)
            ->get();
        if ($final->where('is_done', true)->count() == 0){
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
}
