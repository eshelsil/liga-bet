<?php

namespace App\Http\Controllers;

use App\Competition;
use App\Tournament;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JsonException;

class TournamentController extends Controller
{
    public function createTournament(Request $request) {
        $user = $this->getUser();
        $this->validateCreatePermissions();
        $this->validateCreateInputs($request);
        $tournament = new Tournament();
        $tournament->name = $request->name;
        $tournament->status = Tournament::STATUS_INITIAL;
        $tournament->config = json_encode([]);
        $tournament->competition_id = $request->competition;
        $tournament->code = $this->generateCode();
        $tournament->creator_user_id = $user->id;
        $tournament->save();
        return new JsonResponse($tournament, 200);
    }

    private function generateCode(){
        $length = 6;
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        $charactersCount = strlen($characters);
        $code = '';
        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[rand(0, $charactersCount - 1)];
        }
        return $code;
    }

    private function validateCreatePermissions() {
        $user = $this->getUser();
        if ($user->isAdmin()) return;
        if ($user->isTournamentAdmin()){
            $tournaments = $user->getManagedTouranemnts();
            if (count($tournaments) == 0) return;
            throw new JsonException("לא ניתן לפתוח יותר מטורניר אחד", 401);
        }
        throw new JsonException("אין לך את ההרשאות הדרושות כדי לפתוח טורניר משלך", 401);
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
