<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupsController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $utl->tournament->competition->groups->load("teams");

        $data = $utl->tournament->competition->groups
            ->map(fn(Group $group) => (new GroupResource($group))->toArray($request))
            ->keyBy("id");

        return new JsonResponse($data, 200);
    }
}
