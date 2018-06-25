<?php

namespace App;

use App\Bets\BetMatch\BetMatchRequest;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Exceptions\JsonException;
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
 */
class Match extends Model
{
    protected $scores = [
        "groups" => [
            "winner" => 1,
            "score" => 3
        ],
        "knockout" => [
            "winner" => 3,
            "score" => 8
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

    public function completeBets()
    {
        $this->updateScore();

        echo "Match Home ({$this->getTeamHome()->name}): {$this->result_home} | Away ({$this->getTeamAway()->name}): {$this->result_away}<br><br>";

        /** @var Bet $bet */
        foreach ($this->getBets() as $bet) {
            $betRequest = new BetMatchRequest($this, [
                "result-home" => $bet->getData("result-home"),
                "result-away" => $bet->getData("result-away"),
            ]);
            $bet->score = $betRequest->calculate();
            $bet->save();

            echo "User: {$bet->user->name} Bet home: {$bet->getData("result-home")} Bet away: {$bet->getData("result-away")} Score: {$bet->score}<br><br>";
        }

        return "FINISHED";

    }

    private function updateScore()
    {
        if (!is_null($this->result_home) && !is_null($this->result_home)) {
            return;
        }

        $crawlerMatch = $this->getCrawlerMatch();

        if (!$crawlerMatch->finished) {
            throw new JsonException("Match {$this->id} not finished");
        }

        $this->result_home = $crawlerMatch->home_result;
        $this->result_away = $crawlerMatch->away_result;
        $this->save();
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
        if (!$this->teamHome) { $this->teamHome = Team::query()->find($this->team_home_id); }
        return $this->teamHome;
    }

    /**
     * @return Team
     */
    public function getTeamAway()
    {
        if (!$this->teamAway) { $this->teamAway= Team::query()->find($this->team_away_id); }
        return $this->teamAway;
    }
}
