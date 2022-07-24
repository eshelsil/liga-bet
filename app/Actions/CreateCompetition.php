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
use App\Game;
use App\Team;
use App\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateCompetition
{

    protected Competition $competition;
    protected Collection $teams;
    protected Collection $groups;
    protected Collection $games;

    public function handle(string $id)
    {
        $crawler = Crawler::getInstance($id);

        $teams = $crawler->fetchTeams();
        if ($teams->isEmpty()) {
            throw new \RuntimeException("Cannot find teams");
        }

        $games = $crawler->fetchGames();
        if ($games->isEmpty()) {
            throw new \RuntimeException("Cannot find games");
        }

        Log::debug("[CreateCompetition][handle] Got results! start saving data");
        $this->saveCompetition($id);
        Log::debug("[CreateCompetition][handle] New Competition ({$this->competition->id})! now teams");

        $groups = $teams->pluck('group_id')->unique();
        $this->saveGroups($groups);
        Log::debug("[CreateCompetition][handle] Saved ({$this->groups->count()}) groups! now Games");

        $this->saveTeams($teams);
        Log::debug("[CreateCompetition][handle] Saved ({$this->teams->count()}) teams! now groups");

        $this->saveGames($games);
        Log::debug("[CreateCompetition][handle] Saved ({$this->games->count()}) Games");
    }

    /**
     * @param string $id
     *
     * @return void
     */
    protected function saveCompetition(string $id): void
    {
        $competition         = new Competition();
        $competition->type   = 1; // TODO: One day..
        $competition->name   = "";
        $competition->config = [
            "crawler" => "football-data.org",
            "external_id" => $id,
        ];

        $competition->save();

        $this->competition = $competition;
    }

    private function saveGroups(Collection $groups): Collection
    {
        return $this->groups = $groups->map(function ($group_id) {
            $group = new Group();
            $group->competition_id = $this->competition->id;
            $group->external_id = $group_id;
            $group->name = "Group ".substr($group_id, -1);
            $group->save();

            return $group;
        })->keyBy("external_id");
    }

    private function saveTeams(Collection $teamsData): Collection
    {
        return $this->teams = $teamsData->map(function ($teamData) {
            $team = new Team();
            $team->competition_id = $this->competition->id;
            $team->external_id = data_get($teamData, 'id');
            $team->name = data_get($teamData, 'name');
            $team->crest_url = data_get($teamData, 'crestUrl');
            $team->group_id = $this->groups->get(data_get($teamData, 'group_id'))->id;
            $team->save();

            return $team;
        })->keyBy("external_id");
    }

    private function saveGames(Collection $games): Collection
    {
        $autoBet = (new MonkeyAutoBetCompetitionGames());

        return $this->games = $games->map(function ($gameData) use ($autoBet) {
            $game = new Game();
            $game->competition_id = $this->competition->id;
            $game->external_id  = $gameData['id'];
            $game->type         = $gameData['type'];
            $game->sub_type     = $gameData['sub_type'];
            $game->team_home_id = $this->teams->get($gameData['team_home_id'])->id;
            $game->team_away_id = $this->teams->get($gameData['team_away_id'])->id;
            $game->start_time   = $gameData['start_time'];
            $game->save();

            Log::debug("Saving Game: {$game->team_home_id} {$this->teams->get($gameData['team_home_id'])->name} vs. {$game->team_away_id} {$this->teams->get($gameData['team_away_id'])->name}");

            User::getMonkeyUsers()->each(fn(User $monkey) => $autoBet->handle($monkey, $game));

            return $game;
        })->keyBy("external_id");
    }
}