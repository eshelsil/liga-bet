<?php

namespace App\Http\Controllers;

use App\Competition;
use App\Tournament;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Exceptions\JsonException;
use App\Http\Resources\TournamentResource;

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
        $tournament->config          = ["scores" => [], "prizes" => []];
        $tournament->competition_id  = $request->competition;
        $tournament->code            = Str::lower(Str::random(6));
        $tournament->creator_user_id = $user->id;
        $tournament->save();

        return new JsonResponse($tournament, 200);
    }

    public function updateTournamentPrizes(string $id, Request $request)
    {
        $user = $this->getUser();
        $tournament = $user->ownedTournaments->find($id);
        if (!$tournament) {
            throw new JsonException("אין לך את ההרשאות", 401);
        }

        $request->validate(["prizes.*" => "required|string"]);

        $tournament->update(["config->prizes" => $request->json("prizes")]);

        return new JsonResponse($tournament, 200);
    }

    public function updateTournamentScores(string $id, Request $request)
    {
        $user = $this->getUser();
        $tournament = $user->ownedTournaments->find($id);
        if (!$tournament) {
            throw new JsonException("אין לך את ההרשאות", 401);
        }

        $keys = [
            "gameBets.groupStage.winnerSide",
            "gameBets.groupStage.result",
            "gameBets.knockout.qualifier",
            "gameBets.knockout.winnerSide",
            "gameBets.knockout.result",
            "gameBets.bonuses.final.qualifier",
            "gameBets.bonuses.final.winnerSide",
            "gameBets.bonuses.final.result",
            "gameBets.bonuses.semiFinal.qualifier",
            "gameBets.bonuses.semiFinal.winnerSide",
            "gameBets.bonuses.semiFinal.result",
            "groupRankBets.perfect",
            "groupRankBets.minorMistake",
            "specialBets.offensiveTeam",
            "specialBets.winner.quarterFinal",
            "specialBets.winner.semiFinal",
            "specialBets.winner.final",
            "specialBets.winner.winning",
            "specialBets.runnerUp.quarterFinal",
            "specialBets.runnerUp.semiFinal",
            "specialBets.runnerUp.final",
            "specialBets.mvp",
            "specialBets.topAssists",
            "specialBets.topScorer.correct",
            "specialBets.topScorer.eachGoal",
        ];
        $request->validate(array_fill_keys($keys, ["required", "integer", "min:0"]));

        foreach ($keys as $key) {
            $modelKey = "config->scores->" . str_replace(".", "->", $key);
            $tournament->fill([$modelKey => $request->json($key)]);
        }
        $tournament->save();

        return new JsonResponse((new TournamentResource($tournament))->toArray($request), 200);
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
        if (!$name || strlen($name) < 4) {
            throw new JsonException("שם הטורניר חייב להיות באורך 4 תווים לפחות", 400);
        }
        $competitionId = $request->competition;
        $competition = Competition::find($competitionId);
        if (!$competition) {
            throw new JsonException("Invalid competition input", 400);
        }
        // TODO: handle not-started competition
    }

    private function validateLimitations(User $user) {
        $owned_tournaments_count = $user->ownedTournaments()->count();
        if ($user->isAdmin()) {
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
