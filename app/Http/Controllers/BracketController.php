<?php

namespace App\Http\Controllers;

use App\BracketGame;
use App\Http\Resources\BracketGameResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BracketController extends Controller
{
    /**
     * GET /api/tournaments/{tournamentId}/bracket
     *
     * Returns the knockout bracket structure (contract D — structure part) for the tournament's
     * competition, sourced from the stored BracketGame/BracketSlot model (contract H). The frontend
     * groups the flat list by `round` + `side` to render the tree.
     */
    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        $competition = $utl->tournament->competition;

        if (!$competition->supportsBracket()) {
            return new JsonResponse([], 200);
        }

        $bracketGames = BracketGame::query()
            ->where('competition_id', $competition->id)
            ->with(['slots.team.competition', 'slots.group', 'game'])
            ->orderBy('stage_num')
            ->orderBy('group_num')
            ->get();

        $data = $bracketGames
            ->map(fn(BracketGame $bg) => (new BracketGameResource($bg))->toArray($request))
            ->values();

        return new JsonResponse($data, 200);
    }
}
