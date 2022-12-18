<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlayerResource;
use App\Player;
use App\TournamentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayersController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->competition->players
            ->map(fn(Player $player) => (new PlayerResource($player))->toArray($request));

        return new JsonResponse($data, 200);
    }

    public function getRelevantPlayers(Request $request, string $tournamentId)
    {
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        $competition = $utl->tournament->competition;
        $relevantPlayerIds = collect([]);
        $user->utls
            ->each(
                function(TournamentUser $utl) use ($relevantPlayerIds) {
                    $utl->tournament->getRelevantPlayerIds()->each(function($playerId) use ($relevantPlayerIds) {
                        $relevantPlayerIds->push($playerId);
                    });
                }
            );
        
        $topScorers = $competition->getTopScorersIds(true);
        $topAssists = $competition->getMostAssistsIds(true);
        $relevantPlayerIds = $relevantPlayerIds->merge($topScorers)->merge($topAssists);

        $data = $utl->tournament->competition->players()
            ->whereIn("players.id", $relevantPlayerIds->unique()->filter())->get()
            ->map(fn(Player $player) => (new PlayerResource($player))->toArray($request));

        return new JsonResponse($data, 200);
    }
}
