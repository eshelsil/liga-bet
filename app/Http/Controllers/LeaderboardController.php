<?php

namespace App\Http\Controllers;

use App\Http\Resources\LeaderboardVersionResource;
use App\Leaderboard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Validator;

class LeaderboardController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        LeaderboardVersionResource::withoutWrapping();
        
        $sortedGameIds = $utl->tournament->competition->getSortedGameIds();
        $versions = $utl->tournament->leaderboardVersions;
        return LeaderboardVersionResource::collection(
            $sortedGameIds->reverse()->map(fn($gameId) => $versions->firstWhere('game_id', $gameId))->filter()->all()
        );
        
    }

    public function getLeaderboards(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $ids = json_decode($request->ids);
        $validator = Validator::make(['ids' => $ids], [
            'ids' => 'nullable|array|max:2',
        ])->validate();

        LeaderboardVersionResource::withoutWrapping();

        if (!$ids || collect($ids)->count() == 0){
            $sortedGameIds = $utl->tournament->competition->getSortedGameIds();
            $versionsByGameId = $utl->tournament->leaderboardVersions->keyBy('game_id');
            foreach ($sortedGameIds->reverse() as $gameId){
                $version = $versionsByGameId->get($gameId);
                if ($version){
                    $ids = [$version->id];
                    break;
                }
            }
        }

        return new JsonResponse($utl->tournament->leaderboardVersions()->whereIn('id', $ids)
            ->with("leaderboards")->get()->keyBy('id')
            ->map(
                fn($v) => $v->leaderboards->sortByDesc("score")->map(
                    fn (Leaderboard $l) => $l->only(["id", "user_tournament_id", "rank", "score"])
                )
            ));
        
    }

    public function getLatestFromBetsData(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        LeaderboardVersionResource::withoutWrapping();
        
        return LeaderboardVersionResource::collection(
            $utl->tournament->getLatestLeaderboard()
        );
        
    }
}
