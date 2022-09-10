<?php

namespace App\Bets\BetSpecialBets;

use App\Bets\AbstractBetRequest;
use App\SpecialBets\SpecialBet;
use App\TournamentUser;
use Illuminate\Support\Facades\Log;
use App\Scorer;
use App\Team;
use App\Bet;
use App\Enums\BetTypes;
use Illuminate\Support\Facades\Validator;
use App\Exceptions\JsonException;

class BetSpecialBetsRequest extends AbstractBetRequest
{
    /** @var SpecialBet $specialBet */
    protected $specialBet = null;
    protected $answer = null;
    protected TournamentUser $utl;

    static $scorerIds = null;
    static $teamIds = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param SpecialBet $specialBet
     * @param array $data
     */
    public function __construct($specialBet, $data = []) {
        parent::__construct($specialBet, $data);
        $this->answer   = $data["answer"];
        $this->utl      = $data["utl"];
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
        $this->validateAnswer($specialBet, $answer);
        
    }

    protected function validateAnswer($specialBet, $answer) {
        switch ($specialBet->type) {
            case SpecialBet::TYPE_MVP:
                $this->validateCustomInput($answer);
                break;
            case SpecialBet::TYPE_MOST_ASSISTS:
                $this->validateCustomInput($answer);
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                $this->validateTeamSelection($answer);
                break;
            case SpecialBet::TYPE_WINNER:
                $this->validateTeamSelection($answer);
                if ($this->hasUserBet(SpecialBet::TYPE_RUNNER_UP, $answer)){
                    throw new \InvalidArgumentException("Could not bet \"winner\" as {{$answer}} because user has already bet \"runner_up\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                $this->validateTeamSelection($answer);
                if ($this->hasUserBet(SpecialBet::TYPE_WINNER, $answer)){
                    throw new \InvalidArgumentException("Could not bet \"runner_up\" as {{$answer}} because user has already bet \"winner\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                $this->validateTopScorer($answer);
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"{$this->name}\"");
        }
    }

    protected function validateCustomInput($answer) {
        $validator = Validator::make(["answer" => $answer], [
            'answer' => 'required|string|min:4',
        ]);
    }


    protected function validateTeamSelection($answer) {
        $validator = Validator::make(["answer" => $answer], [
            'answer' => 'required|integer',
        ]);
        $teamIds = static::getTeamIds();
        if (!in_array($answer, $teamIds)){
            throw new \InvalidArgumentException("Team id {{$answer}} does not exist.");
        }
    }

    protected function hasUserBet($betName, $answer) {
        $bet = $this->utl->bets
            ->where('type', BetTypes::SpecialBet)
            ->where('type_id', SpecialBet::getByType($betName)->id)
            ->first();

        if (!$bet) {
            return false;
        }

        return $bet->getAnswer() == $answer;
    }

    public function validateTopScorer($answer) {
        $scorerIds = static::getScorerIds();
        if (!in_array($answer, $scorerIds)){
            throw new \InvalidArgumentException("Scorers table has no player with id \"{{$answer}}\"");
        }
    }

    public static function getScorerIds() {
        if (static::$scorerIds){
            return static::$scorerIds;
        }
        return static::$scorerIds = Scorer::all(['external_id'])->pluck('external_id')->toArray();
    }

    public static function getTeamIds() {
        if (static::$teamIds){
            return static::$teamIds;
        }
        return static::$teamIds = Team::all(['id'])->pluck('id')->toArray();
    }

    public function getSpecialBet()
    {
        return $this->specialBet;
    }

    /**
     * @return int
     */
    public function getAnswer() {
        return $this->answer;
    }

    public function calculate($irrelevant = null) {
        return $this->getEntity()->calculateScore($this->getAnswer());
    }



    protected function setEntity($entity = null)
    {
        $this->specialBet = $entity;
    }

    public function getEntity()
    {
        return $this->getSpecialBet();
    }
}
