<?php

namespace App\Bets\BetSpecialBets;

use App\Bets\AbstractBetRequest;
use App\SpecialBets\SpecialBet;
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
    protected $user = null;

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
        $this->answer      = data_get($data, "answer");
        $this->user      = data_get($data, "user", null);
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
        switch ($specialBet->getName()) {
            case "mvp":
                $this->validateCustomInput($answer);
                break;
            case "most_assists":
                $this->validateCustomInput($answer);
                break;
            case "offensive_team":
                $this->validateTeamSelection($answer);
                break;
            case "winner":
                $this->validateTeamSelection($answer);
                if ($this->hasUserBet('runner_up', $answer)){
                    throw new \InvalidArgumentException("Could not bet \"winner\" as {{$answer}} because user has already bet \"runner_up\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
                break;
            case "runner_up":
                $this->validateTeamSelection($answer);
                if ($this->hasUserBet('winner', $answer)){
                    throw new \InvalidArgumentException("Could not bet \"runner_up\" as {{$answer}} because user has already bet \"winner\" as {{$answer}}. 'winner' & 'runner_up' bets cannot be the same");
                }
                break;
            case "top_scorer":
                $this->validateTopScorer($answer);
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"$this->name\"");
        };
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
        $specialBetId = SpecialBet::getBetTypeIdByName($betName);
        $user = $this->getUser();
        if (!$user){
            return false;
        }
        $user_id = $user->id;
        $bet = Bet::where('type', BetTypes::SpecialBet)
            ->where('type_id', $specialBetId)
            ->where('user_id', $user_id)
            ->first();
        if (!$bet){
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

    public function getUser()
    {
        return $this->user;
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
