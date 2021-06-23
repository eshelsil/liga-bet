<?php

namespace App\SpecialBets;

use App\Bets\BetableInterface;
use \Illuminate\Support\Collection;
use App\Match;
use App\Bet;
use App\Team;
use App\Scorer;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;

class SpecialBet implements BetableInterface
{

    protected $id = null;
    protected $name = null;
    protected $title = null;
    static $teamsColl = null;


    private static $source = [
        "1" => ["name" => "winner", "title" => "זוכה"],
        "2" => ["name" => "runner_up", "title" => "סגנית"],
        "3" => ["name" => "top_scorer", "title" => "מלך השערים"],
        "4" => ["name" => "most_assists", "title" => "מלך הבישולים"],
        "5" => ["name" => "mvp", "title" => "מצטיין הטורניר"],
        "6" => ["name" => "offensive_team", "title" => "ההתקפה החזקה בבתים"],
    ];

    public function getOffensiveTeams(){
        $matches = Match::getGroupStageGamesIfStageDone();
        if (!$matches){
            return null;
        }
        $gsByTeamId = [];
        foreach($matches as $match){
            $goals_data = $match->getGoalsData();
            foreach($goals_data as $teamId => $gs){
                if (!array_key_exists($teamId, $gsByTeamId)){
                    $gsByTeamId[$teamId] = 0;
                }
                $gsByTeamId[$teamId] += $gs;
            }
        }
        $gs_values = array_values($gsByTeamId);
        $max_gs = max($gs_values);
        $best_offensive_teams = [];
        foreach($gsByTeamId as $teamId => $goalsScored){
            if ($goalsScored == $max_gs){
                array_push($best_offensive_teams, $teamId);
            }
        }
        
        $teamExtIdToId = Team::getExternalIdToIdMap();
        return array_map(function($ext_team_id) use($teamExtIdToId){
            return $teamExtIdToId[$ext_team_id];
        }, $best_offensive_teams);
    }

    public function calculateOffensiveTeam($team_id){
        $score = 5;
        
        $best_offensive_teams = $this->getOffensiveTeams();
        if ($best_offensive_teams == null){
            return null;
        }
        if (in_array($team_id, $best_offensive_teams)){
            return $score;
        }
        return 0;
    }

    public function calcMVP($player_name){
        $score = 10;

        $mvp = config('bets.mvp');
        if (!$mvp){
            return null;
        }
        return $player_name == $mvp ? $score : 0;
    }

    public function getTopAssists(){
        $topAssistsPlayers = config('bets.topAssists');
        if ($topAssistsPlayers && !is_array($topAssistsPlayers)){
            $topAssistsPlayers = array($topAssistsPlayers);
        }
        return $topAssistsPlayers;
    }

    public function calcTopAssists($player_name){
        $score = 10;
        
        $topAssitsPlayers = $this->getTopAssists();
        if (!$topAssitsPlayers){
            return null;
        }
        return in_array($player_name, $topAssitsPlayers) ? $score : 0;
    }


    public function getChampions(){
        $final = Match::getFinalMatchIfDone();
        if (!$final){
            return null;
        }
        return $final->getKnockoutWinner();
    }

    public function getRunnerUp(){
        $final = Match::getFinalMatchIfDone();
        if (!$final){
            return null;
        }
        return $final->getKnockoutLoser();
    }


    public function calcRoadToFinal($team_id){
        $score_for_stage = 5;

        $score = 0;
        $team_ext_id = Team::find($team_id)->external_id;
        $ko_games = Match::getTeamKnockoutGames($team_ext_id);
        if ($ko_games->count() == 0){
            return null;
        }
        foreach($ko_games as $game){
            if ($game->sub_type == 'FINAL'){
                return;
            }
            if ($game->getKnockoutWinner() == $team_ext_id){
                $score += $score_for_stage;
            }
        }
        return $score;
    }

    public function calcChampions($team_id){
        $score_for_winning_final = 15;

        $score = $this->calcRoadToFinal($team_id);
        $final = Match::getFinalMatchIfDone();
        if (!$final){
            return $score;
        }
        if ($final->getKnockoutWinner() == $team_id){
            $score += $score_for_winning_final;
        }
        return $score;
    }

    public function getTopScorers(){
        return Scorer::getTopScorers();
    }

    public function calcTopScorer($player_id){
        $score_for_goal = 2;
        $top_scorer_bonus = 4;

        $score = 0;
        $scorer = Scorer::findByExternalId($player_id);
        $most_goals = Scorer::getTopGoalsCount();
        if ($most_goals !== null){
            if ($scorer->goals == $most_goals){
                $score += $top_scorer_bonus;
            }
        }
        $score += ($score_for_goal * $scorer->goals);
        return $score;
    }


    public function calculateBets(){
        $bets = Bet::query()
            ->where("type", BetTypes::SpecialBet)
            ->where("type_id", $this->id)
            ->get();
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetSpecialBetsRequest($this, $bet->getData());
                $score = $betRequest->calculate();
                $bet->score = $score;
                $bet->save();
                if ($score !== null){
                    echo "USER {$bet->user_id} Score ({$bet->score}) RANKS: {$betRequest->toJson()}<br>";
                }
            } catch (Exception $exception) {
                return $exception->getMessage();
                continue 1;
            }
        }
        return "OK";
    }



    /**
     * Group constructor.
     *
     * @param null  $id
     * @param array $data
     */
    public function __construct($id, array $data)
    {
        $this->id       = $id;
        $this->title = $data["title"];
        $this->name    = $data["name"];
    }

    public function getID()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getName()
    {
        return $this->name;
    }

    public static function getBetTypeIdByName($name)
    {
        foreach(self::$source as $typeId => $data){
            if ($data['name'] == $name){
                return $typeId;
            }
        }
    }


    public function calculateScore($bet_answer)
    {
        switch ($this->name) {
            case "mvp":
                return $this->calcMVP($bet_answer);
                break;
            case "most_assists":
                return $this->calcTopAssists($bet_answer);
                break;
            case "offensive_team":
                return $this->calculateOffensiveTeam($bet_answer);
                break;
            case "winner":
                return $this->calcChampions($bet_answer);
                break;
            case "runner_up":
                return $this->calcRoadToFinal($bet_answer);
                break;
            case "top_scorer":
                return $this->calcTopScorer($bet_answer);
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"$this->name\"");
        };
    }

    public function getAnswer()
    {
        switch ($this->name) {
            case "mvp":
                return config('bets.mvp');
                break;
            case "most_assists":
                return $this->getTopAssists();
                break;
            case "offensive_team":
                return $this->getOffensiveTeams();
                break;
            case "winner":
                return $this->getChampions();
                break;
            case "runner_up":
                return $this->getRunnerUp();
                break;
            case "top_scorer":
                return $this->getTopScorers()->map(function($player){
                    return $player->external_id;
                })->toArray();
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"$this->name\"");
        };
    }

    private function formatTeamDescription($answer){
        $teams = static::getTeamsCollection();
        $team = $teams->find($answer);
        if (!$team){
            return "Invalid Bet team_id ". $answer;
        }
        return view('widgets.teamWithFlag')->with($team->toArray());
    }

    public function formatDescription($answer){
        if ($answer == null){
            return null;
        }
        if (!is_array($answer)){
            $answer = [$answer];
        }
        $res = implode('<br>', array_map(
            function ($ans){
                switch ($this->name) {
                    case "top_scorer":
                        $scorer = Scorer::findByExternalId($ans);
                        $teams = static::getTeamsCollection();
                        $team = $teams->find($scorer->team_id);
                        return view('widgets.teamWithFlag')->with([
                            "name" => $scorer->name,
                            "crest_url" => $team->crest_url
                        ]);
                        break;
                    case "winner":
                        return $this->formatTeamDescription($ans);
                        break;
                    case "runner_up":
                        return $this->formatTeamDescription($ans);
                        break;
                    case "offensive_team":
                        return $this->formatTeamDescription($ans);
                        break;
                    default:
                        return $ans;
                };
            }
        , $answer));
        return $res;
    }

    public static function getTeamsCollection()
    {
        if (static::$teamsColl) {
            return static::$teamsColl;
        }
        return static::$teamsColl = Team::all();
    }

    public function generateRandomBetData()
    {
        $answer = null;
        switch ($this->name) {
            case "mvp":
                $answer = Scorer::all()->random()->name;
                break;
            case "most_assists":
                $answer = Scorer::all()->random()->name;
                break;
            case "offensive_team":
                $answer = Team::all()->random()->id;
                break;
            case "winner":
                $answer = Team::all()->random()->id;
                break;
            case "runner_up":
                $answer = Team::all()->random()->id;
                break;
            case "top_scorer":
                $answer = Scorer::all()->random()->external_id;
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"$name\"");
        };
        return json_encode(["answer" => $answer]);
    }


    /**
     * @return Collection|static[]
     */
    public static function all()
    {
        $specialBets = [];
        foreach (self::$source as $id => $data) {
            $specialBets[] = new self($id, $data);
        }

        return Collection::make($specialBets);
    }

    /**
     * @param $id
     *
     * @return static
     */
    public static function find($id)
    {
        $data = array_get(self::$source, $id);
        return new self($id, $data);
    }
}