<?php

namespace App\Http\Controllers;

use App\Competition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompetitionController extends Controller
{
    public function index(Request $request)
    {
        $competitions = Competition::all();

        return new JsonResponse($competitions->keyBy('id'), 200);
    }
}
