<?php

namespace App\Http\Controllers;

use App\Http\Resources\LeaderboardVersionResource;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {
        $allVersions = $request->allVersions;
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        LeaderboardVersionResource::withoutWrapping();
        
        if ($allVersions) {
            return LeaderboardVersionResource::collection(
                $utl->tournament->leaderboardVersions
                    ->sortByDesc("created_at")
                    ->load("leaderboards")
            );
        }
        return LeaderboardVersionResource::collection(
            $utl->tournament->get2LatestRelevantVersions()
        );
        
    }
}
