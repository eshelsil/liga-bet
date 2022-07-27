<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Group;
use App\TournamentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GroupsController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        Log::warning("[GroupsController][index] Received request!");
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $utl->tournament->competition->groups->load("teams");

        $data = $utl->tournament->competition->groups
            ->map(fn(Group $group) => (new GroupResource($group))->toArray($request))
            ->keyBy("id");

        return new JsonResponse($data, 200);
    }
}
