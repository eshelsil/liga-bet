<?php

namespace App\Bets\BetSpecialBets;

use App\Bets\AbstractBetRequest;
use App\SpecialBets\SpecialBet;
use Illuminate\Support\Facades\Log;

class BetSpecialBetsRequest extends AbstractBetRequest
{
    /** @var SpecialBet $specialBet */
    protected $specialBet = null;
    protected $answer = null;

    /**
     * BetGroupRankRequest constructor.
     *
     * @param SpecialBet $specialBet
     * @param array $data
     */
    public function __construct($specialBet, $data = []) {
        parent::__construct($specialBet, $data);
        $this->answer      = data_get($data, "answer");
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
        // Todo:
        // if (data_get($data, "answer")) {
        //     throw new \InvalidArgumentException("invalid answers");
        // }
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
        $score = 0;
        /** @var BetSpecialBetsRequest $answers */
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
