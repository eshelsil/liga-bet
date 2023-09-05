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
use App\Player;
use App\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class CreateCompetition
{

    protected Competition $competition;
    protected Collection $teams;
    protected Collection $groups;
    protected Collection $games;
    protected Collection $players;

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

        $playersByTeam = $teams->mapWithKeys(function($team) use ($crawler) {
            Log::debug("[CreateCompetition][handle] Getting team {$team["id"]} {$team["name"]}");
            return [$team["id"] => $crawler->fetchPlayersByTeamId($team["id"])];
        });

        $teamsWithoutPlayers = $playersByTeam->filter(fn(Collection $players) => $players->isEmpty())->keys();
        if ($teamsWithoutPlayers->isNotEmpty()) {
            throw new \RuntimeException("Cannot find players for teams {$teamsWithoutPlayers->join(",")}");
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
        Log::debug("[CreateCompetition][handle] Saved ({$this->games->count()}) Games! now Players");

        $this->savePlayers($playersByTeam);
        Log::debug("[CreateCompetition][handle] Saved ({$this->players->count()}) Players");
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
        return $this->games = $games->map(function (\App\DataCrawler\Game $crawlerGame) {
            $game = new Game();
            $game->competition_id = $this->competition->id;
            $game->external_id  = $crawlerGame->externalId;
            $game->type         = $crawlerGame->type;
            $game->sub_type     = $crawlerGame->subType;
            $game->team_home_id = $this->teams->get($crawlerGame->teamHomeExternalId)->id;
            $game->team_away_id = $this->teams->get($crawlerGame->teamAwayExternalId)->id;
            $game->start_time   = $crawlerGame->startTime;
            $game->save();

            Log::debug("Saving Game: {$game->team_home_id} {$this->teams->get($crawlerGame->teamHomeExternalId)->name} vs. {$game->team_away_id} {$this->teams->get($crawlerGame->teamAwayExternalId)->name}");

            return $game;
        })->keyBy("external_id");
    }

    private function savePlayers(Collection $playersByTeam): Collection
    {
        return $this->players = $playersByTeam->reduce(function (Collection $allPlayers, Collection $teamPlayers, $externalTeamId) {
            $team = $this->teams->get($externalTeamId);
            /** @var \App\DataCrawler\Player $playerData */
            foreach ($teamPlayers as $playerData) {
                $allPlayers[] = Player::generate($team, $playerData);
//                $allPlayers[$playerData->externalId] = Player::generate($team, $playerData);
            }

            Log::debug("Saved ({$teamPlayers->count()}) Players for team [{$team->id}]{$team->name}");

            return $allPlayers;
        }, new Collection());
    }

    public function updatePlayers(Competition $competition)
    {
        $this->teams = $competition->teams->keyBy("external_id");

        $playersByTeam = $this->teams->mapWithKeys(function(Team $team) {
            Log::debug("[CreateCompetition][handle] Getting team {$team->external_id}");
            return [$team->external_id => $team->competition->getCrawler()->fetchPlayersByTeamId($team->external_id)];
        });

        $this->savePlayers($playersByTeam);
    }
}