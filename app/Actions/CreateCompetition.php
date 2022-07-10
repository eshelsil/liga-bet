<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 09/07/2022
 * Time: 22:30
 */

namespace App\Actions;

use App\Competition;
use App\DataCrawler\Crawler;
use App\Group;
use App\Match;
use App\Team;
use App\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Log;

class CreateCompetition
{

    protected Competition $competition;
    protected Collection $teams;
    protected Collection $groups;
    protected Collection $matches;

    public function handle(string $id)
    {
        $crawler = Crawler::getInstance($id);

        $teams = $crawler->fetchTeams();
        if ($teams->isEmpty()) {
            throw new \RuntimeException("Cannot find teams");
        }

        $matches = $crawler->fetchMatches();
        if ($matches->isEmpty()) {
            throw new \RuntimeException("Cannot find matches");
        }

        $this->saveCompetition($id);

        $this->saveTeams($teams);

        $groups = $teams->pluck('group_id')->unique();
        $this->saveGroups($groups);

        $this->saveMatches($matches);
    }

    /**
     * @param string $id
     *
     * @return void
     */
    protected function saveCompetition(string $id): void
    {
        $competition         = new Competition();
        $competition->name   = "";
        $competition->config = [
            "crawler" => "football-data.org",
            "external_id" => $id,
        ];

        $competition->save();

        $this->competition = $competition;
    }

    private function saveTeams(Collection $teamsData): Collection
    {
        return $this->teams = $teamsData->map(function ($teamData) {
            $team = new Team();
            $team->competition_id = $this->competition->id;
            $team->external_id = data_get($teamData, 'id');
            $team->name = data_get($teamData, 'name');
            $team->crest_url = data_get($teamData, 'crestUrl');
            $team->group_id = data_get($teamData, 'group_id');
            $team->save();

            return $team;
        });
    }

    private function saveGroups(Collection $groups): Collection
    {
        return $this->groups = $groups->map(function ($group_id) {
            $group = new Group();
            $group->external_id = $group_id;
            $group->name = "Group ".substr($group_id, -1);
            $group->save();

            return $group;
        });
    }

    private function saveMatches(Collection $matches): Collection
    {
        return $this->matches = $matches->map(function ($matchData) {
            $match = new Match();
            $match->competition_id = $this->competition->id;
            $match->external_id  = $matchData['id'];
            $match->type         = $matchData['type'];
            $match->sub_type     = $matchData['sub_type'];
            $match->team_home_id = $matchData['team_home_id'];
            $match->team_away_id = $matchData['team_away_id'];
            $match->start_time   = $matchData['start_time'];
            $match->save();

            Log::debug("Saving Match: ".$match->team_home_id." vs. ".$match->team_away_id."<br>");

            User::getMonkeyUsers()->each(function($monkey){
                $monkey->autoBetNewMatches();
            });

            return $match;
        });
    }
}