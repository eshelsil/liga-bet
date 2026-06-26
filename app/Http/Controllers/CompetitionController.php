<?php

namespace App\Http\Controllers;

use App\Competition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\CompetitionResource;

class CompetitionController extends Controller
{
    public function index(Request $request)
    {
        $competitions = Competition::all();
        $data = $competitions->map(
            fn(Competition $competition) => (new CompetitionResource($competition))->toArray($request)
        );

        return new JsonResponse($data->keyBy('id'), 200);
    }
}
