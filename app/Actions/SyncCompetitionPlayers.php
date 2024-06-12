<?php


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

class SyncCompetitionPlayers
{

    protected Competition $competition;
    protected Collection $teams;

    public function handle(Competition $competition)
    {
        if ($competition->has_started()){
            throw new \RuntimeException("Cannot update players after competition has started");
        }

        Log::debug("[SyncCompetitionPlayers][handle] started for competition {$competition->id}");

        $this->updatePlayers($competition);
        
    }


    public function updatePlayers(Competition $competition)
    {
        $this->teams = $competition->teams->keyBy("external_id");

        $playersByTeam = $this->teams->mapWithKeys(function(Team $team) {
            Log::debug("[SyncCompetitionPlayers][handle] Getting team {$team->external_id}");
            return [$team->external_id => $team->competition->getCrawler()->fetchPlayersByTeamId($team->external_id)];
        });

        $this->syncNewPlayers($playersByTeam);
    }

    private function syncNewPlayers(Collection $playersByTeam)
    {
        foreach ($playersByTeam as $externalTeamId => $teamPlayers) {
            $team = $this->teams->get($externalTeamId);
            $existingPlayers = Player::where('team_id', $team->id)->get()->keyBy('external_id');
    
            /** @var \App\DataCrawler\Player $playerData */
            foreach ($teamPlayers as $playerData) {
                if (isset($existingPlayers[$playerData->externalId])) {
                    // Update existing player
                    $player = $existingPlayers[$playerData->externalId];
                    $player->name = $playerData->name;
                    $player->shirt = $playerData->shirt;
                    $player->save();
                    // Remove from the existing players list to keep track of players to be removed
                    unset($existingPlayers[$playerData->externalId]);
                } else {
                    // Add new player
                    Player::generate($team, $playerData);
                }
            }
    
            // Remove players that are not fetched
            foreach ($existingPlayers as $player) {
                Log::debug("Deleting player from database (id: {$player->id}, externalId: {$player->external_id}) {$player->name}");
                $player->delete();
            }
    
            Log::debug("Synced ({$teamPlayers->count()}) Players for team [{$team->id}] {$team->name}");
        }
    }
}