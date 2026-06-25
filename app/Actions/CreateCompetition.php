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
use Illuminate\Support\Str;

class CreateCompetition
{

    protected Competition $competition;
    protected Collection $teams;
    protected Collection $groups;
    protected Collection $games;
    protected Collection $players;

    /**
     * @param string      $id          crawler id (football-data code, kept as config.external_id)
     * @param int|null    $id365       365 competition id (required when $source === SOURCE_365)
     * @param string      $source      Competition::SOURCE_FOOTBALL_DATA (default) | SOURCE_365
     * @param array       $extraConfig merged into the competition config (e.g. ['bracket' => [...]])
     */
    public function handle(string $id, ?int $id365 = null, string $source = Competition::SOURCE_FOOTBALL_DATA, array $extraConfig = [])
    {
        $crawler = Crawler::getInstance($id)->withSource($source, $id365);

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
            // 365-sourced (e.g. bracket) competitions may have incomplete squads pre-tournament — don't block creation.
            if ($source === Competition::SOURCE_365) {
                Log::warning("[CreateCompetition][handle] Missing players for teams {$teamsWithoutPlayers->join(",")} (continuing, 365 source)");
            } else {
                throw new \RuntimeException("Cannot find players for teams {$teamsWithoutPlayers->join(",")}");
            }
        }

        Log::debug("[CreateCompetition][handle] Got results! start saving data");
        $this->saveCompetition($id, $id365, $source, $extraConfig);
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
    protected function saveCompetition(string $id, ?int $id365 = null, string $source = Competition::SOURCE_FOOTBALL_DATA, array $extraConfig = []): void
    {
        $competition         = new Competition();
        $competition->type   = 1; // TODO: One day..
        $competition->name   = "";
        $competition->status = Competition::STATUS_INITIAL;

        $config = [
            "crawler"     => $source === Competition::SOURCE_365 ? "365scores" : "football-data.org",
            "external_id" => $id,
        ];
        if ($source === Competition::SOURCE_365) {
            $config["source"]    = Competition::SOURCE_365;
            $config["id_on_365"] = $id365;
        }

        if (Str::lower($id) == 'ec'){
            $competition->emblem = "https://upload.wikimedia.org/wikipedia/en/thumb/2/26/UEFA_Euro_2024_Logo.svg/220px-UEFA_Euro_2024_Logo.svg.png";
            $competition->name="יורו 2024";
        }
        if (Str::lower($id) == 'wc' || Str::lower($id) == 'wc2026'){
            $config = array_merge($config, ["type" => Competition::TYPE_WC_48]);
            $competition->name = "מונדיאל 2026";
            $competition->emblem = "/img/tournaments/WorldCup_2026.png";
        }

        // caller overrides (e.g. ['bracket' => [...]]) win.
        $competition->config = array_replace_recursive($config, $extraConfig);

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