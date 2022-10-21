<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Player;
use App\SpecialBets\SpecialBet;
use App\Team;

class UpdateCompetitionScorers
{
    private CalculateSpecialBets $calculateSpecialBets;

    public function __construct(CalculateSpecialBets $calculateSpecialBets) {
        $this->calculateSpecialBets = $calculateSpecialBets;
    }

    public function handle(Competition $competition)
    {
        $scorers = $competition->getCrawler()->fetchScorers();

        $relevantScorers = $competition->players->keyBy("external_id");
        foreach ($scorers as $scorer){
            $id = data_get($scorer, 'player.id');
            $goals = data_get($scorer, 'numberOfGoals');
            $scorerModel = $relevantScorers->get($id);
            $scorerModel->goals = $goals;
            $scorerModel->save();
        }

        $answer = $competition->getTopScorersIds()->join(",") ?: null;

        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
    }
}