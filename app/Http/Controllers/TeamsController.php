<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamsController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->competition->teams
            ->map(fn(Team $team) => (new TeamResource($team)));

        return new JsonResponse($data, 200);
    }
}
