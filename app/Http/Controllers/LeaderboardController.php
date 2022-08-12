<?php

namespace App\Http\Controllers;

use App\Http\Resources\LeaderboardVersionResource;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        LeaderboardVersionResource::withoutWrapping();

        return LeaderboardVersionResource::collection(
            $utl->tournament->leaderboardVersions
                ->sortByDesc("created_at")
                ->load("leaderboards")
        );
    }
}
