<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 12/11/2022
 * Time: 22:30
 */

namespace App\Actions;

use App\Bet;
use App\Enums\BetTypes;
use App\Player;
use App\SpecialBets\SpecialBet;
use App\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class RefetchTeamPlayers
{
    public function handle(string $id)
    {
        $team = Team::find($id);

        $crawler = $team->competition->getCrawler();

        $playersData = $crawler->fetchPlayersByTeamId($team->external_id);
        if ($playersData->isEmpty()) {
            throw new \RuntimeException("Cannot find teams");
        }

        $this->savePlayers($team, $playersData);
    }


    private function savePlayers(Team $team, Collection $apiPlayers): void
    {
        $players = $team->players->keyBy("external_id");
        $apiPlayers = $apiPlayers->keyBy(fn(\App\DataCrawler\Player $p) => $p->externalId);

        $countDeleted = $players->diffKeys($apiPlayers)
            ->each(fn (Player $player) => $this->deletePlayer($player->setRelation("team", $team)))
            ->count();

        Log::debug("[RefetchTeamPlayers][savePlayers] Deleted ({$countDeleted}) Players");

        $countGenerated = $apiPlayers->diffKeys($players)
            ->each(fn (\App\DataCrawler\Player $p) => Player::generate($team, $p))
            ->count();

        Log::debug("[RefetchTeamPlayers][savePlayers] Generated ({$countGenerated}) Players");

        $team->unsetRelation("players");
    }

    private function deletePlayer(Player $player): void
    {
        $specialBetIds = SpecialBet::whereIn("tournament_id", $player->team->competition->tournaments->modelKeys())
                                   ->whereIn("type", [SpecialBet::TYPE_MVP, SpecialBet::TYPE_TOP_SCORER, SpecialBet::TYPE_MOST_ASSISTS])
                                   ->pluck("id");

        $betsOnPlayer = Bet::query()
            ->where("type", BetTypes::SpecialBet)
            ->whereIn("type_id", $specialBetIds)
            ->get(["id", "data"])
            ->filter(fn(Bet $bet) => $bet->getData("answer") == $player->id);
        if ($betsOnPlayer->isNotEmpty()) {
            $betsOnPlayer->toQuery()->delete();
        }

        $player->delete();
    }
}