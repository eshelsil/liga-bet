<?php

namespace App;

use App\Bets\BetableInterface;
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
 * @property bool $is_done
 */
class Match extends Model implements BetableInterface
{
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

    public function completeBets()
    {
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

    public function isClosedToBets()
    {
        return $this->start_time < time() + config("bets.lockBeforeSeconds");
    }

    public function getID()
    {
        return $this->id;
    }
}
