<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlayerResource;
use App\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayersController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->competition->players
            ->map(fn(Player $player) => (new PlayerResource($player))->toArray($request))
            ->keyBy("id");

        return new JsonResponse($data, 200);
    }
}
