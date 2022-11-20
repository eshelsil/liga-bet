<?php

namespace App\Http\Controllers;

use App\Game;
use App\GameDataGoal;
use App\Http\Resources\GameGoalsDataResource;
use App\Http\Resources\GameResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamesController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $utl->tournament->competition->games->load(["teamHome", "teamAway"]);

        $data = $utl->tournament->competition->games
            ->map(fn(Game $group) => (new GameResource($group))->toArray($request));

        return new JsonResponse($data, 200);
    }

    public function getGoalsData(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->competition->goalsData
            ->map(fn(GameDataGoal $goalsData) => (new GameGoalsDataResource($goalsData))->toArray($request));
        
        return new JsonResponse($data, 200);
    }
}
