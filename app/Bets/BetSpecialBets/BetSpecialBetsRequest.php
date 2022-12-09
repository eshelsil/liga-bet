<?php

namespace App\Bets\BetSpecialBets;

use App\Bets\AbstractBetRequest;
use App\Bets\BetableInterface;
use App\Enums\GameSubTypes;
use App\Game;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use Illuminate\Support\Facades\Log;
use App\Player;
use App\Team;
use App\Bet;
use App\Enums\BetTypes;
use Illuminate\Support\Facades\Validator;
use App\Exceptions\JsonException;
use InvalidArgumentException;

class BetSpecialBetsRequest extends AbstractBetRequest
{
    /** @var SpecialBet $specialBet */
    protected $specialBet = null;
    protected $answer = null;
    protected TournamentUser $utl;

    static $playerIds = null;
    static $teamIds = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param SpecialBet $specialBet
     * @param array $data
     */
    public function __construct(BetableInterface $specialBet, Tournament $tournament, array $data = []) {
        parent::__construct($specialBet, $tournament, $data);
        $this->utl      = $data["utl"];
        $this->answer   = $data["answer"];
    }

    public function toJson() {
        return json_encode([
            "answer" => $this->answer,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param SpecialBet $specialBet
     * @param array $data
     */
    protected function validateData($specialBet, $data) {
//        Log::debug("Validating data: [{$specialBet->type}] {$specialBet->getID()} - Data: ". json_encode($data));
        $answer = data_get($data, "answer");
        if (is_null($answer)) {
            throw new \InvalidArgumentException("Could not parse \"answer\" from bet value");
        }
        $utl      = $data["utl"];
        $this->validateAnswer($specialBet, $answer, $utl);
        
    }

    protected function validateAnswer($specialBet, $answer, $utl) {
        switch ($specialBet->type) {
            case SpecialBet::TYPE_MVP:
            case SpecialBet::TYPE_MOST_ASSISTS:
                $this->validatePlayerSelection($answer);
                $this->validatePlayerSelection($answer);
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                $this->validateTeamSelection($answer);
                break;
            case SpecialBet::TYPE_WINNER:
                $this->validateTeamSelection($answer);
                // Removed to prevent errors thrown during calculation (it should be relevant only for when updateing the bet's answer)
                // if ($this->hasUserBet(SpecialBet::TYPE_RUNNER_UP, $answer, $utl)) {
                //     throw new \InvalidArgumentException("לא ניתן לבחור אותה קבוצה כזוכה וגם כסגנית");
                // }
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                $this->validateTeamSelection($answer);
                // Removed to prevent errors thrown during calculation (it should be relevant only for when updateing the bet's answer)
                // if ($this->hasUserBet(SpecialBet::TYPE_WINNER, $answer, $utl)) {
                //     throw new \InvalidArgumentException("לא ניתן לבחור אותה קבוצה כזוכה וגם כסגנית");
                // }
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                $this->validatePlayerSelection($answer);
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet type \"{$specialBet->type}\"");
        }
    }

    protected function validateCustomInput($answer) {
        $validator = Validator::make(["answer" => $answer], [
            'answer' => 'required|string|min:4',
        ])->validate();
    }


    protected function validateTeamSelection($answer) {
        $validator = Validator::make(["answer" => $answer], [
            'answer' => 'required|integer',
        ])->validate();

        if (!$this->tournament->competition->teams->contains($answer)){
            throw new \InvalidArgumentException("Team id {{$answer}} does not exist.");
        }
    }

    protected function hasUserBet($betName, $answer, TournamentUser $utl) {
        $specialQuestion = SpecialBet::getByType($utl->tournament_id, $betName);
        $bet = $utl->bets
            ->where('type', BetTypes::SpecialBet)
            ->where('type_id', $specialQuestion->id)
            ->first();

        if (!$bet) {
            return false;
        }
        if (!$specialQuestion->isOn()){
            return false;
        }

        return $bet->getAnswer() == $answer;
    }
    public function validatePlayerSelection($answer) {
        $validator = Validator::make(["answer" => $answer], [
            'answer' => 'required|integer',
        ]);
        if (!$this->tournament->competition->players->contains($answer)){
            throw new \InvalidArgumentException("Scorers table has no player with id \"{{$answer}}\"");
        }
    }

    public function getSpecialBet()
    {
        return $this->specialBet;
    }

    public function calculate($irrelevant = null): ?int
    {
        return match ($this->getEntity()->type) {
            SpecialBet::TYPE_MVP => $this->calcMVP(),
            SpecialBet::TYPE_MOST_ASSISTS => $this->calcTopAssists(),
            SpecialBet::TYPE_OFFENSIVE_TEAM => $this->calculateOffensiveTeam(),
            SpecialBet::TYPE_WINNER => $this->calcRoadToFinal("winner"),
            SpecialBet::TYPE_RUNNER_UP => $this->calcRoadToFinal("runnerUp"),
            SpecialBet::TYPE_TOP_SCORER => $this->calcTopScorer(),
            default => throw new InvalidArgumentException("Invalid SpecialBet name \"{$this->getEntity()->type}\""),
        };
    }

    public function calculateScoreForGame(Game $game): int
    {
        if (!$game->is_done){
            return 0;
        }
        return match ($this->getEntity()->type) {
            SpecialBet::TYPE_MVP => $this->calcMVPForGame($game),
            SpecialBet::TYPE_MOST_ASSISTS => $this->calcTopAssistsForGame($game),
            SpecialBet::TYPE_OFFENSIVE_TEAM => $this->calculateOffensiveTeamForGame($game),
            SpecialBet::TYPE_WINNER => $this->calcRoadToFinalForGame($game, "winner"),
            SpecialBet::TYPE_RUNNER_UP => $this->calcRoadToFinalForGame($game, "runnerUp"),
            SpecialBet::TYPE_TOP_SCORER => $this->calcTopScorerForGame($game),
            default => throw new InvalidArgumentException("Invalid SpecialBet name \"{$this->getEntity()->type}\""),
        };
    }



    protected function setEntity($entity = null)
    {
        $this->specialBet = $entity;
    }

    public function getEntity()
    {
        return $this->getSpecialBet();
    }

    public function calcMVP()
    {
        if (!$mvp = $this->getSpecialBet()->answer) {
            return null;
        }

        if ($this->answer != $mvp) {
            return 0;
        }

        return $this->getScoreConfig("specialBets.mvp");
    }

    public function calcTopAssists()
    {
        $score = 0;
        /** @var Player $player */
        $player = $this->tournament->competition->players->find($this->answer);
        $score += $player->assists * $this->getScoreConfig("specialBets.topAssists.eachGoal");

        $players = $this->getSpecialBet()->answer;
        if ($players && in_array($this->answer, explode(",", $players))) {
            $score += $this->getScoreConfig("specialBets.topAssists.correct") ?? $this->getScoreConfig("specialBets.topAssists"); // Fallback to prevent BC
        }

        return $score;
    }

    public function calculateOffensiveTeam()
    {
        if (!$teams = $this->getSpecialBet()->answer) {
            return null;
        }

        if (!in_array($this->answer, explode(",", $teams))) {
            return 0;
        }

        return $this->getScoreConfig("specialBets.offensiveTeam");
    }

    public function calcRoadToFinal(string $type): int
    {
        $koGames = $this->tournament->competition->getKnockoutGames($this->answer);

        $score = 0;
        foreach ($koGames as $game) {
            if ($game->getKnockoutWinner() == $this->answer){
                if ($game->sub_type == GameSubTypes::LAST_16) {
                    $score += $this->getScoreConfig("specialBets.{$type}.quarterFinal");
                } else if ($game->sub_type == GameSubTypes::QUARTER_FINALS) {
                    $score += $this->getScoreConfig("specialBets.{$type}.semiFinal");
                } else if ($game->sub_type == GameSubTypes::SEMI_FINALS) {
                    $score += $this->getScoreConfig("specialBets.{$type}.final");
                } else if ($game->sub_type == GameSubTypes::FINAL) {
                    $score += $this->getScoreConfig("specialBets.{$type}.winning");
                }
            }
        }

        return $score;
    }

    public function calcTopScorer()
    {
        $score = 0;
        $player = $this->tournament->competition->players->find($this->answer);
        $score += $player->goals * $this->getScoreConfig("specialBets.topScorer.eachGoal");

        $players = $this->getSpecialBet()->answer;
        if ($players && in_array($this->answer, explode(",", $players))) {
            $score += $this->getScoreConfig("specialBets.topScorer.correct");
        }

        return $score;
    }



    public function calcMVPForGame(Game $game)
    {
        if ($game->sub_type == 'FINAL') {
            return $this->calcMVP();
        }
        return 0;
    }

    public function calcTopAssistsForGame(Game $game)
    {
        $score = 0;
        $goalsData = $game->scorers->firstWhere('player_id', $this->answer);
        if ($goalsData) {
            $score += $goalsData->assists * $this->getScoreConfig("specialBets.topAssists.eachGoal");
        }

        if ($game->sub_type == 'FINAL') {
            $players = $this->getSpecialBet()->answer;
            if ($players && in_array($this->answer, explode(",", $players))) {
                $score += $this->getScoreConfig("specialBets.topAssists.correct") ?? $this->getScoreConfig("specialBets.topAssists"); // Fallback to prevent BC
            }
        }

        return $score;
    }

    public function calculateOffensiveTeamForGame(Game $game)
    {
        // TODO - calc offensive team if gameId is last game of groupStage
        return 0;
    }

    public function calcRoadToFinalForGame(Game $game, string $type): int
    {
        if ($game->type != 'knockout') {
            return 0;
        }
        if ($game->getKnockoutWinner() == $this->answer){
            if ($game->sub_type == GameSubTypes::LAST_16) {
                return $this->getScoreConfig("specialBets.{$type}.quarterFinal");
            } else if ($game->sub_type == GameSubTypes::QUARTER_FINALS) {
                return $this->getScoreConfig("specialBets.{$type}.semiFinal");
            } else if ($game->sub_type == GameSubTypes::SEMI_FINALS) {
                return $this->getScoreConfig("specialBets.{$type}.final");
            } else if ($game->sub_type == GameSubTypes::FINAL) {
                return $this->getScoreConfig("specialBets.{$type}.winning");
            }
        }
        return 0;
    }

    public function calcTopScorerForGame(Game $game)
    {
        $score = 0;
        $goalsData = $game->scorers->firstWhere('player_id', $this->answer);
        if ($goalsData) {
            $score += $goalsData->goals * $this->getScoreConfig("specialBets.topScorer.eachGoal");
        }

        if ($game->sub_type == 'FINAL') {
            $players = $this->getSpecialBet()->answer;
            if ($players && in_array($this->answer, explode(",", $players))) {
                $score += $this->getScoreConfig("specialBets.topScorer.correct");
            }
        }

        return $score;
    }
}
