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
use Illuminate\Database\Eloquent\Collection;

class CalculateSpecialBets
{
    public function execute(int $competitionId, string $type, $answer = null, $useNullAnswer = false) {
        SpecialBet::where("type", $type)
            ->whereHas('tournament.competition', function ($query) use ($competitionId) {
                $query->where('id', $competitionId);
            })
            ->get()
            ->when(($answer || $useNullAnswer), function(Collection $specialBets) use ($answer) {
                $specialBets->toQuery()->update(["answer" => $answer]);

                // update by toQuery allows bulk but not updates the model
                $specialBets->each(fn(SpecialBet $s) => $s->answer = $answer);

                return $specialBets;
            })
            ->each(fn(SpecialBet $specialBet) => $specialBet->calculateBets());

        return "completed";
    }
}