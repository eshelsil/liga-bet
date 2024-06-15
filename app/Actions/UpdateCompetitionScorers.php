<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Game;
use App\Player;
use App\GameDataGoal;
use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Collection;

class UpdateCompetitionScorers
{
    private ?\Illuminate\Support\Collection $fakeScorers = null;

    private $relevantGames;

    public function __construct(private readonly CalculateSpecialBets $calculateSpecialBets,
        private readonly SavePleyerGameGoalsData $savePleyerGameGoalsData,
    ) { }


    public function fake(?\Illuminate\Support\Collection $scorers = null)
    {
        $this->fakeScorers = $scorers;
    }

    public function getRelevantGameIds(){
        if ($this->relevantGames){
            return $this->relevantGames->pluck('id');
        }
        return collect([]);
    }

            
    public function handleOld(Competition $competition)
    {

        // TODO: deprecate
        $this->relevantGames = $competition->games->whereBetween('start_time', [now()->subHours(24)->timestamp, now()->timestamp]);
        $teams = new Collection();
        $this->relevantGames->load(["teamHome", "teamAway"])
            ->each(fn(Game $g) => $teams->add($g->teamHome)->add($g->teamAway));
        $scorers = $this->fakeScorers ?? $competition->getCrawler()->fetchScorers($teams->pluck("external_id"));
        \Log::debug("[UpdateScorers][handle] got {{$scorers->count()}} scorers" );

        $players = $competition->players->keyBy("external_id");
        $newGoalsAndAssistsData = [];
        /** @var \App\Game $game */
        $hasDoneGames = false;
        /** @var \App\DataCrawler\Player $scorer */
        foreach ($scorers as $scorer) {
            /** @var Player $player */
            $player = $players->get($scorer->externalId);
            // TODO: Create?
            if ($player) {
                \Log::debug("[UpdateScorers][handle] updating player ID [{$player->id}] external [{$scorer->externalId}] to G{$scorer->goals}A{$scorer->assists}");
                
                $game = $this->relevantGames->first(fn($g) => in_array($player->team_id, [$g->team_home_id, $g->team_away_id]));
                $gameId = $game->id;

                if (!is_null($scorer->goals) || !is_null($scorer->assists)){
                    $this->savePleyerGameGoalsData->handle($player->id, $gameId, $scorer->goals ?? 0, $scorer->assists ?? 0);
                }

                if ($game->is_done){
                    $hasDoneGames = true;
                    $goalsDiff = $scorer->goals - $player->goals;
                    $assistsDiff = $scorer->assists - $player->assists;
                    $hasGoalsChange = !is_null($scorer->goals) && $goalsDiff != 0;
                    $hasAssistsChange = !is_null($scorer->assists) && $assistsDiff != 0;
                    if (($hasGoalsChange || $hasAssistsChange) && !array_key_exists($gameId, $newGoalsAndAssistsData)){
                        $newGoalsAndAssistsData[$gameId] = [
                            "scorers" => [],
                            "assists" => [],
                        ];
                    }
                    if ($hasGoalsChange){
                        $newGoalsAndAssistsData[$gameId]["scorers"][$player->id] = $goalsDiff;
                    }
                    if ($hasAssistsChange){
                        $newGoalsAndAssistsData[$gameId]["assists"][$player->id] = $assistsDiff;
                    }
                    $player->goals   = $scorer->goals   ?? $player->goals;
                    $player->assists = $scorer->assists ?? $player->assists;
                    $player->save();
                }
            }
        }

        if ($hasDoneGames) {
            $competition->unsetRelation("players");
            $answer = $competition->getTopScorersIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
            $answer = $competition->getMostAssistsIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_MOST_ASSISTS, $answer);
        }

    }

    public function handle(Competition $competition)
    {
        $extId = $competition->get365Id();
        if (!$extId){
            return $this->handleOld($competition);
        }

        $startedBeforeMins = 60 * 24 * 2;
        $safetyRangeMins = 60 * 1;
        $relevantDbGames = $competition->games->whereBetween('start_time', [now()->subMinutes($startedBeforeMins)->subMinutes($safetyRangeMins)->timestamp, now()->addMinutes($safetyRangeMins)->timestamp]);
        $gamesToFixScorers = $competition->games->whereIn('id', $competition->getGamesToFixScorers());
        $relevantDbGames = $relevantDbGames->merge($gamesToFixScorers);
        $this->relevantGames = $relevantDbGames;
        $dbGamesCollection = $relevantDbGames->map(fn(Game $g) => collect([
            "id" => $g->id,
            "start_time" => $g->start_time,
            "team_home_id" => $g->teamHome->external_id,
            "team_away_id" => $g->teamAway->external_id,
        ]))->keyBy('id');
        $gamesToFixColection = $gamesToFixScorers->map(fn(Game $g) => collect([
            "id" => $g->id,
            "start_time" => $g->start_time,
            "team_home_id" => $g->teamHome->external_id,
            "team_away_id" => $g->teamAway->external_id,
        ]));

        try {
            $scorersByGameId = $this->fakeScorers ?? $competition->getCrawler()->fetchScorersOfLatestGames($extId, $dbGamesCollection, $gamesToFixColection, $startedBeforeMins);
            foreach ($scorersByGameId as $gameId => $scorers){
                \Log::debug("[UpdateScorers][handle] got {{$scorers->count()}} scorers for game $gameId");
            }
        } catch (\Throwable $e) {
            \Log::error('[UpdateScorers][handle] Failed to fetch scorers: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return;
        }


        $players = $competition->players->keyBy("external_id");
        $newGoalsAndAssistsData = [];
        /** @var \App\Game $game */
        $hasDoneGames = false;
        /** @var \App\DataCrawler\Player $scorer */
        foreach ($scorersByGameId as $gameId => $scorers) {
            /** @var Player $player */
            $game = Game::find($gameId);
            $gameId = $game->id;
            $isGameDone = $game->is_done;
            $updatedPlayers = collect([]);
            foreach($scorers as $playerExtId => $scorerData){
                $player = $players->get($playerExtId);
                if ($player){
                    $goals = $scorerData["goals"];
                    $assists = $scorerData["assists"];
                    \Log::debug("[UpdateScorers][handle] updating player ID [{$player->id}] external [{$playerExtId}] to G{$goals}A{$assists}");
                    GameDataGoal::updateOrInsert(
                        ['game_id' => $gameId, 'player_id' => $player->id],
                        ['goals' => $goals, 'assists' => $assists, 'created_at' => now(), 'updated_at' => now()],
                    );
                    \Log::debug("[UpdateScorers][handle] Updated Player $player->id on Game $gameId  G-$goals  A-$assists");

                    $updatedPlayers->add($player->id);
                } else {
                    \Log::error("[UpdateScorers][handle] Got scorer data but could not find player on database. playerExtId: $playerExtId");
                }
            }
            $goalsDataToRemove = $game->scorers()->whereNotIn("player_id", $updatedPlayers)->get();
            foreach ($goalsDataToRemove as $gameGoalsData){
                $playerId = $gameGoalsData["player_id"];
                \Log::warning("[UpdateScorers][handle] Removing existing gameGoalsData row of player $playerId on game $gameId because he had no goals/assists.");
                $updatedPlayers->add($playerId);
                $gameGoalsData->delete();
            }
            if ($isGameDone){
                $hasDoneGames = true;
                foreach($updatedPlayers as $playerId) {
                    $player = Player::find($playerId);
                    $player->goals = $player->goalsData->sum("goals", 0);
                    $player->assists = $player->goalsData->sum("assists", 0);
                    $player->save();
                    \Log::debug("[UpdateScorers][handle] Updated Player $player->id total scorer-data:  G-$player->goals  A-$player->assists");
                }
            }
        }

        if ($hasDoneGames) {
            $competition->unsetRelation("players");
            $answer = $competition->getTopScorersIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
            $answer = $competition->getMostAssistsIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_MOST_ASSISTS, $answer);
        }

    }
}