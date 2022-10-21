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

        $relevantScorers = $competition->players;
        $saveFirstAnyway = $competition->isDone();

        $mostGoals = null;
        foreach ($scorers as $index => $scorer){
            $id = data_get($scorer, 'player.id');
            if (!$relevantScorers->pluck('external_id')->contains($id)) {
                if (!$saveFirstAnyway) {
                    continue;
                }

                if ($index == 0){
                    $mostGoals = data_get($scorer, 'numberOfGoals');
                } else if (data_get($scorer, 'numberOfGoals') !== $mostGoals) {
                    $saveFirstAnyway = false;
                    continue;
                }

                $scorerModel = new Player();
                $scorerModel->external_id = $id;
                $scorerModel->name = data_get($scorer, 'player.name');
                $team = Team::where('external_id', data_get($scorer, 'team.id'))->first();
                $scorerModel->team_id = $team->id;
                $relevantScorers->push($scorerModel);
            }

            $goals = data_get($scorer, 'numberOfGoals');
            $scorerModel = $relevantScorers->where('external_id', $id)->first();
            if ($goals !== $scorerModel->goals){
                $scorerModel->goals = $goals;
                $scorerModel->save();
            }
        }

        $answer = $competition->getTopScorersIds()->join(",") ?: null;

        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
    }
}