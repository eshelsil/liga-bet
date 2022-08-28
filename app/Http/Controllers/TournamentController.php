<?php

namespace App\Http\Controllers;

use App\Competition;
use App\Tournament;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Exceptions\JsonException;

class TournamentController extends Controller
{
    public function createTournament(Request $request)
    {
        $user = $this->getUser();
        $this->validateCreatePermissions();
        $this->validateCreateInputs($request);
        $tournament                  = new Tournament();
        $tournament->name            = $request->name;
        $tournament->status          = Tournament::STATUS_INITIAL;
        $tournament->config          = json_encode([]);
        $tournament->competition_id  = $request->competition;
        $tournament->code            = Str::lower(Str::random(6));
        $tournament->creator_user_id = $user->id;
        $tournament->save();

        return new JsonResponse($tournament, 200);
    }

    private function validateCreatePermissions()
    {
        $user = $this->getUser();
        if (! $user->isAdmin()) {
            throw new JsonException("אין לך את ההרשאות הדרושות כדי לפתוח טורניר משלך", 401);
        }

        if ($user->isTournamentAdmin()) {
            if ($user->getManagedTouranemnts()->isNotEmpty()) {
                throw new JsonException("לא ניתן לפתוח יותר מטורניר אחד", 401);
            }
        }
    }

    private function validateCreateInputs(Request $request) {
        $name = $request->name;
        if (!$name || strlen($name) < 4){
            throw new JsonException("שם הטורניר חייב להיות באורך 4 תווים לפחות", 400);
        }
        $competitionId = $request->competition;
        $competition = Competition::find($competitionId);
        if (!$competition){
            throw new JsonException("Invalid competition input", 400);
        }
        // TODO: handle not-started competition
    }
}
