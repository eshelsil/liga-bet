<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 16/07/2022
 * Time: 19:11
 */

namespace App\Actions;

use App\Competition;
use App\SpecialBets\SpecialBet;

class CalculateSpecialBets
{
    public function execute(int $competitionId, string $type, $answer = null) {
        // TODO: SpecialBet -> Eloquent. add competitionId
        // ->where("competition_id", $competition->id)
        SpecialBet::where("type", $type)
            ->when($answer, fn(SpecialBet $specialBet) => $specialBet->update(["answer" => $answer]))
            ->each(fn(SpecialBet $specialBet) => $specialBet->calculateBets());

        return "completed";
    }
}