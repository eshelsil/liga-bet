<?php

namespace App\Http\Controllers;

use App\Actions\CreateTournamentSpecialBets;
use App\Competition;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Exceptions\JsonException;
use App\Http\Resources\TournamentResource;

class TournamentController extends Controller
{
    public function createTournament(Request $request, CreateTournamentSpecialBets $ctsb)
    {
        $user = $this->getUser();
        $this->validateCreatePermissions();
        $this->validateCreateInputs($request);
        $this->validateCreateLimitations($user);
        $tournament                  = new Tournament();
        $tournament->name            = $request->name;
        $tournament->status          = Tournament::STATUS_INITIAL;
        $tournament->config          = ["scores" =>  [], "prizes" => []];
        $tournament->competition_id  = $request->competition;
        $tournament->code            = Str::lower(Str::random(6));
        $tournament->creator_user_id = $user->id;
        $tournament->save();

        $ctsb->handle($tournament);

        return new JsonResponse((new TournamentResource($tournament))->toArray($request), 200);
    }

    public function getTournamentName(string $code, Request $request)
    {
        $tournament = Tournament::where('code', $code)->first();
        if (!$tournament){
            throw new JsonException("לא נמצא טורניר עם הקוד \"$code\"", 400);
        }
        return new JsonResponse($tournament->name, 200);
    }

    protected function generateSpecialBets(Tournament $tournament): void
    {
        $tournament->specialBets()->delete();

        $map = [
            SpecialBet::TYPE_WINNER         => ["winner.final"      , "אלופת הטורניר"],
            SpecialBet::TYPE_RUNNER_UP      => ["runnerUp.final"    , "סגנית הטורניר"],
            SpecialBet::TYPE_TOP_SCORER     => ["topScorer.correct" , "מלך השערים"],
            SpecialBet::TYPE_MOST_ASSISTS   => ["topAssists"        , "מלך הבישולים"],
            SpecialBet::TYPE_MVP            => ["mvp"               , "מצטיין הטורניר - MVP"],
            SpecialBet::TYPE_OFFENSIVE_TEAM => ["offensiveTeam"     , "ההגנה החזקה בשלב הבתים"],
        ];

        foreach ($map as $type => $data) {
            if (data_get($tournament->config, "scores.specialBets.{$data[1]}")) {
                $specialBet = new SpecialBet();
                $specialBet->tournament()->associate($tournament);
                $specialBet->type  = $type;
                $specialBet->title = $data[1];
                $specialBet->save();
            }
        }
    }

    public function updateTournamentPrizes(string $id, Request $request)
    {
        $this->validateUpdatePermissions($id);
        $user = $this->getUser();
        $tournament = $user->ownedTournaments->find($id);

        $request->validate(["prizes.*" => "required|string"]);

        $tournament->update(["config->prizes" => $request->json("prizes")]);

        return new JsonResponse((new TournamentResource($tournament))->toArray($request), 200);
    }

    public function updateTournamentScores(string $id, Request $request)
    {
        $this->validateUpdatePermissions($id);
        $user = $this->getUser();
        $tournament = $user->ownedTournaments->find($id);

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
        $booleanKeys = [
            "specialQuestionFlags.winner",
            "specialQuestionFlags.runnerUp",
            "specialQuestionFlags.topScorer",
            "specialQuestionFlags.mvp",
            "specialQuestionFlags.topAssists",
            "specialQuestionFlags.offensiveTeam",
        ];
        $request->validate(array_merge(
            array_fill_keys($keys, ["required", "integer", "min:0"]),
            array_fill_keys($booleanKeys, ["required", "boolean"]),
        ));

        foreach (array_merge($keys, $booleanKeys) as $key) {
            $modelKey = "config->scores->" . str_replace(".", "->", $key);
            $tournament->fill([$modelKey => $request->json($key)]);
        }
        $tournament->save();

        return new JsonResponse((new TournamentResource($tournament))->toArray($request), 200);
    }

    private function validateUpdatePermissions(int $tournamentId)
    {
        $user = $this->getUser();
        if (! $user->hasTournamentAdminPermissions()) {
            throw new JsonException("אין לך את ההרשאות הדרושות כדי לעדכן טורנירים", 401);
        }
        $tournament = $user->ownedTournaments->find($tournamentId);
        if (!$tournament) {
            throw new JsonException("אין לך את ההרשאות הדרושות כדי לעדכן את הטורניר הזה", 401);
        }
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

        if (Tournament::where('name', $name)->exists()) {
            throw new JsonException("קיים כבר טורניר עם השם \"$name\"", 400);
        }
    }

    private function validateCreateLimitations(User $user) {
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
