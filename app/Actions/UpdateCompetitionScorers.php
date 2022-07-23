<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Scorer;
use App\Team;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Database\Eloquent\Collection;

class UpdateCompetitionScorers
{
    private CalculateSpecialBets $calculateSpecialBets;

    public function __construct(CalculateSpecialBets $calculateSpecialBets) {
        $this->calculateSpecialBets = $calculateSpecialBets;
    }

    public function handle(Competition $competition)
    {
        $scorers = $competition->getCrawler()->fetchScorers();

        $relevantScorers = $competition->scorers;
        $saveFirstAnyway = $competition->isDone();

        $mostGoals = null;
        foreach ($scorers as $index => $scorer){
            $id = data_get($scorer, 'player.id');
            if (!$relevantScorers->pluck('external_id')->contains($id)) {
                if (!$saveFirstAnyway) {
                    continue;
                };
                if ($index == 0){
                    $mostGoals = data_get($scorer, 'numberOfGoals');
                } else if (data_get($scorer, 'numberOfGoals') !== $mostGoals){
                    $saveFirstAnyway = false;
                    continue;
                }
                $scorerModel = new Scorer();
                $scorerModel->competition_id = $competition->id;
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

        $this->calculateSpecialBets->execute($competition->id, ['top_scorer']);
    }
}