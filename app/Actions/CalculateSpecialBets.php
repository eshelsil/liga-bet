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
    public function execute(int $competitionId, $types = null) {
        // TODO: SpecialBet -> Eloquent. add competitionId
        // ->where("competition_id", $competition->id)
        SpecialBet::all()->each(function(SpecialBet $specialBet) use ($types, $competitionId) {
            if ($types && !in_array($specialBet->getName(), $types)) {
                return;
            }
            $specialBet->calculateBets($competitionId);
        });

        return "completed";
    }
}