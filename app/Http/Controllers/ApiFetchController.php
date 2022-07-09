<?php

namespace App\Http\Controllers;

use App\Ranks;
use Illuminate\Http\Request;
use App\DataCrawler\Crawler;
use Illuminate\Support\Facades\Cache;
use App\Match;
use App\Team;
use App\User;
use App\Group;
use App\SpecialBets\SpecialBet;
use App\Scorer;

class ApiFetchController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware("confirmed_user");
    }   

    public function fetchGames($useSpareApiToken = false){
        $crawler = Crawler::getInstance();
        $matches = $crawler->fetchMatches($useSpareApiToken);
        
        $this->saveNewMatches($matches);
    }

    public function fetchScorers(){
        $crawler = Crawler::getInstance();
        $scorers = $crawler->fetchScorers();
        $this->updateScorers($scorers);
    }

    public function fetchStandings(){
        $crawler = Crawler::getInstance();
        $final_standings = $crawler->fetchGroupStandings();
        $team_ext_id_to_id = Team::getExternalIdToIdMap();
        $groupsNotCompleted = Group::all()->filter(function($g){
            return !$g->isComplete();
        });
        $relevantGroupIds = $groupsNotCompleted->pluck('external_id')->toArray();
        foreach($final_standings as $group_id => $standings){
            if (!in_array($group_id, array_values($relevantGroupIds))){
                continue;
            }
            $group = $groupsNotCompleted->where('external_id', $group_id)->first();
            $standings = $standings->map(function($row) use ($team_ext_id_to_id){
                $external_team_id = $row['team_ext_id'];
                $row['team_id'] = $team_ext_id_to_id[$external_team_id];
                return $row;
            });
            $group->standings = json_encode($standings);
            $group->save();
            echo "updated final standings of group \"{$group->name}\"<br>";
            $group->calculateBets();
        }
    }

    private function saveNewMatches($matches) {
        $existingMatches = Match::all();
        $new_matches = $matches->filter(function($m) use ($existingMatches){
            $id = data_get($m, 'id');
            return !in_array($id, $existingMatches->pluck('external_id')->toArray());
        });

        $matches_with_no_score = $existingMatches->where("is_done", false)
                                    ->keyBy->external_id;
        $new_scores = $matches->filter(function($m) use ($matches_with_no_score){
            $id = data_get($m, 'id');
            return data_get($m, 'is_done') && in_array($id, $matches_with_no_score->pluck('external_id')->toArray());
        });

        foreach ($new_matches as $match_data) {
            $match = new Match();
            $match->external_id  = data_get($match_data, 'id');
            $match->type         = data_get($match_data, 'type');
            $match->sub_type     = data_get($match_data, 'sub_type');
            $match->team_home_id = data_get($match_data, 'team_home_id');
            $match->team_away_id = data_get($match_data, 'team_away_id');
            $match->start_time   = data_get($match_data, 'start_time');
            echo("Saving Match: ".$match->team_home_id." vs. ".$match->team_away_id."<br>");
            $match->save();
            User::getMonkeyUsers()->each(function($monkey){
                $monkey->autoBetNewMatches();
            });
        }

        foreach ($new_scores as $match_data)  {
            $match = $matches_with_no_score->where('external_id', data_get($match_data, 'id'))->first();
            $match->result_home  = data_get($match_data, 'result_home');
            $match->result_away  = data_get($match_data, 'result_away');
            $match->ko_winner  = data_get($match_data, 'ko_winner');
            $match->save();

            $this->user_fetch_got_games = true;
            echo("Saving Result of Match: ext_id - ".$match->external_id." | id - ".$match->id."-> ".$match->result_home." - ".$match->result_away."<br>");
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
            if (Match::isGroupStageDone()){
                $this->calculateSpecialBets(['offensive_team']);
            }
            Ranks::updateRanks();
        }
    }

    private function updateScorers($scorers) {
        $relevantScorers = Scorer::all();
        $saveFirstAnyway = Match::isTournamentDone();
        $mostGoals = null;
        foreach ($scorers as $index => $scorer){
            $id = data_get($scorer, 'player.id');
            if (!in_array($id, $relevantScorers->pluck('external_id')->toArray())){
                if (!$saveFirstAnyway){
                    continue;
                };
                if ($index == 0){
                    $mostGoals = data_get($scorer, 'numberOfGoals');
                } else if (data_get($scorer, 'numberOfGoals') !== $mostGoals){
                    $saveFirstAnyway = false;
                    continue;
                }
                $scorerModel = new Scorer();
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
        $this->calculateSpecialBets(['top_scorer']);
    }

    public function calculateSpecialBets($types = null) {
        SpecialBet::all()->each(function($specialBet) use ($types){
            if ($types && !in_array($specialBet->getName(), $types)){
                return;
            }
            $specialBet->calculateBets();
        });

        return "completed";
    }

    public function userUpdateGames() {
        $this->user_fetch_got_games = false;
        if ($blockEndAt = Cache::get("general_api_update")) {
            return response("SERVER_ERROR_MSG:". "עדכון תוצאות חסום מכיוון שכבר בוצעה קריאת עדכון ב5 הדקות האחרונות. יהיה ניתן לנסות לעדכן שוב בשעה:<br>{$blockEndAt}", 400);
        }
        if (!Match::hasOneWaitingForResult()){
            return response("SERVER_ERROR_MSG:". "לא בוצע עדכון מכיוון שאין משחקים שממתינים לתוצאות", 400);
        }
        try {
            $apiBlockageMinutes = config('api.throttling_minutes');
            Cache::put("general_api_update", now()->addMinutes($apiBlockageMinutes)->format("Y-m-d H:i:s"), now()->addMinutes($apiBlockageMinutes));
            $this->fetchGames(true);
        } catch (\Throwable $e) {
            Cache::forget("general_api_update");
            return response("SERVER_ERROR_MSG:".$e->getMessage(), 500);
        }
        if (!$this->user_fetch_got_games){
            $error_msg = "למשחקים שעבורם נדרש עדכון עדיין אין תוצאות זמינות";
            return response("SERVER_ERROR_MSG:".$error_msg, 400);
        }
        $success_msg = "העדכון בוצע בהצלחה";
        return response("SERVER_SUCCESS_MSG:".$success_msg, 200);
    }

}
