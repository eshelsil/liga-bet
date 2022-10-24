<?php

namespace App\Http\Controllers;

use App\Http\Resources\SpecialQuestionResource;
use App\SpecialBets\SpecialBet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecialQuestionsController extends Controller
{

    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->specialBets
            ->map(fn(SpecialBet $specialQuestion) => (new SpecialQuestionResource($specialQuestion))->toArray($request));

        return new JsonResponse($data, 200);
    }
}
