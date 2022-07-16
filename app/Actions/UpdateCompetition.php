<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 10/07/2022
 * Time: 1:27
 */

namespace App\Actions;

use App\Competition;
use App\DataCrawler\Crawler;
use App\Group;
use App\Game;
use App\Ranks;
use App\User;
use Log;

class UpdateCompetition
{

    public function handle(Competition $competition)
    {
        $crawler = $competition->getCrawler();
        $matches = $crawler->fetchMatches();
        $existingMatches = $competition->matches;

        $this->saveNewMatches($matches, $existingMatches);

        $matches_with_no_score = $existingMatches->where("is_done", false)
            ->keyBy->external_id;

        $new_scores = $matches->filter(function($m) use ($matches_with_no_score){
            $id = data_get($m, 'id');
            return data_get($m, 'is_done') && in_array($id, $matches_with_no_score->pluck('external_id')->toArray());
        });

        foreach ($new_scores as $match_data)  {
            $match = $matches_with_no_score->get(data_get($match_data, 'id'));
            $match->result_home  = data_get($match_data, 'result_home');
            $match->result_away  = data_get($match_data, 'result_away');
            $match->ko_winner    = data_get($match_data, 'ko_winner');
            $match->save();

            $this->user_fetch_got_games = true;
            Log::debug("Saving Result of Game: ext_id - ".$match->external_id." | id - ".$match->id."-> ".$match->result_home." - ".$match->result_away."<br>");
            $match->completeBets();
            if ($match->isKnockout()){
                $this->calculateSpecialBets(['winner', 'runner_up']);
            }
        }
        if (count($new_scores) > 0){
            $this->fetchScorers();
            if (!Group::hasAllGroupsStandings()){
                $this->fetchStandings();
            }
            if (Game::isGroupStageDone()){
                $this->calculateSpecialBets(['offensive_team']);
            }
            Ranks::updateRanks();
        }
    }

    /**
     * @param \Illuminate\Support\Collection $matches
     * @param                                $existingMatches
     *
     * @return void
     */
    protected function saveNewMatches(
        \Illuminate\Support\Collection $matches,
        $existingMatches
    ): void {
        $newMatches = $matches->filter(function ($m) use ($existingMatches) {
            return ! in_array($m['id'], $existingMatches->pluck('external_id')->toArray());
        });

        foreach ($newMatches as $match_data) {
            $match               = new Game();
            $match->external_id  = data_get($match_data, 'id');
            $match->type         = data_get($match_data, 'type');
            $match->sub_type     = data_get($match_data, 'sub_type');
            $match->team_home_id = data_get($match_data, 'team_home_id');
            $match->team_away_id = data_get($match_data, 'team_away_id');
            $match->start_time   = data_get($match_data, 'start_time');
            Log::debug("Saving Game: " . $match->team_home_id . " vs. "
                       . $match->team_away_id . "<br>");
            $match->save();
            User::getMonkeyUsers()->each(function ($monkey) {
                $monkey->autoBetNewMatches();
            });
        }
    }
}