<?php

namespace App\Http\Controllers;

use App\Competition;
use App\Tournament;
use App\User;
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
        $this->validateLimitations($user);
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
        if (! $user->hasTournamentAdminPermissions()) {
            throw new JsonException("אין לך את ההרשאות הדרושות כדי לפתוח טורניר משלך", 401);
        }

        if ($user->isTournamentAdmin()) {
            if ($user->ownedTournaments()->count() > 0) {
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

    private function validateLimitations(User $user) {
        $owned_tournaments_count = $user->ownedTournaments()->count();
        if ($user->isAdmin()){
            if ($owned_tournaments_count >= 3) {
                throw new JsonException("אדמינים לא יכולים ליצור מעל 3 טורנירים", 403);
            }
        } else {
            if ($owned_tournaments_count >= 1) {
                throw new JsonException("לא ניתן ליצור יותר מטורניר אחד", 403);
            }
        }
        if (Tournament::count() >= 50) {
            throw new JsonException("נפתחו כבר 50 טורנירים, לא ניתן ליצור טורניר חדש", 403);
        }
    }
}
