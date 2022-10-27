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
        Log::debug("Validating data: {$specialBet->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
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
                if ($this->hasUserBet(SpecialBet::TYPE_RUNNER_UP, $answer, $utl)) {
                    throw new \InvalidArgumentException("Could not bet \"winner\" as {{$answer}} because user has already bet \"runner_up\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                $this->validateTeamSelection($answer);
                if ($this->hasUserBet(SpecialBet::TYPE_WINNER, $answer, $utl)) {
                    throw new \InvalidArgumentException("Could not bet \"runner_up\" as {{$answer}} because user has already bet \"winner\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
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
        $bet = $utl->bets
            ->where('type', BetTypes::SpecialBet)
            ->where('type_id', SpecialBet::getByType($utl->tournament_id, $betName)->id)
            ->first();

        if (!$bet) {
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
        if (!$players = $this->getSpecialBet()->answer) {
            return null;
        }

        if (!in_array($this->answer, explode(",", $players))) {
            return 0;
        }

        return $this->getScoreConfig("specialBets.topAssists");
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

        if ($koGames->contains("sub_type", GameSubTypes::QUARTER_FINALS)) {
            $score += $this->getScoreConfig("specialBets.{$type}.quarterFinal");

            if ($koGames->contains("sub_type", GameSubTypes::SEMI_FINALS)) {
                $score += $this->getScoreConfig("specialBets.{$type}.semiFinal");

                /** @var ?Game $final */
                if ($final = $koGames->firstWhere("sub_type", GameSubTypes::FINAL)) {
                    $score += $this->getScoreConfig("specialBets.{$type}.final");

                    if ($final->getKnockoutWinner() == $this->answer) {
                        $score += $this->getScoreConfig("specialBets.{$type}.winning");
                    }
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
}
