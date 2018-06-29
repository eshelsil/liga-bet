<?php

namespace App\Bets\BetSpecialBets;

use App\Bets\AbstractBetRequest;
use App\Groups\Group;
use App\SpecialBets\SpecialBet;
use Illuminate\Support\Facades\Log;

class BetSpecialBetsRequest extends AbstractBetRequest
{
    /** @var SpecialBet $specialBet */
    protected $specialBet = null;
    protected $answers = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param SpecialBet $specialBet
     * @param array $data
     */
    public function __construct($specialBet, $data = []) {
        parent::__construct($specialBet, $data);
        $this->answers      = data_get($data, "answers");
    }

    public function toJson() {
        return json_encode([
            "answers" => $this->answers,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param SpecialBet $specialBet
     * @param array $data
     */
    protected function validateData($specialBet, $data) {
        Log::debug("Validating data: {$specialBet->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        if (!is_array(data_get($data, "answers")) || !count(data_get($data, "answers"))) {
            throw new \InvalidArgumentException("invalid answers");
        }
    }

    public function getSpecialBet()
    {
        return $this->specialBet;
    }

    /**
     * @return int
     */
    public function getAnswers() {
        return $this->answers;
    }

    public function calculate(AbstractBetRequest $answers) {
        $score = 0;
        /** @var BetSpecialBetsRequest $answers */
        if ($answers->getAnswers() === $this->getAnswers()) {
            $score += $this->specialBet->getScore();
        }

        return $score;
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
