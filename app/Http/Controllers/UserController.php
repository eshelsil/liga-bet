<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContestantResource;
use App\Http\Resources\UtlResource;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use JsonException;

class UserController extends Controller
{
    public function showSetPassword()
    {
        return view('set_password');
    }

    public function getUser()
    {
        $user = Auth::user();
        return $user;
    }

    public function getUserUTLs(Request $request)
    {
        $user = Auth::user();
        $data = $user->utls
            ->map(
                fn(TournamentUser $utl) => (new UtlResource($utl))->toArray($request)
            )
            ->keyBy("id");
        return new JsonResponse($data, 200);
    }

    public function joinTournament(Request $request)
    {
        $name = $request->json("name");
        if (!$name || strlen($name) < 2) {
            throw new JsonException("השם שלך בטורניר חייב להכיל לפחות 2 תווים", 400);
        }

        $tournamentCode = $request->json("code");
        if ( ! $tournamentCode) {
            throw new JsonException("לא הוזן קוד טורניר", 400);
        }

        $tournament = Tournament::where('code', $tournamentCode)->first();
        if ( ! $tournament) {
            throw new JsonException("לא נמצא טורניר עם הקוד $tournamentCode", 400);
        }

        $user        = Auth::user();
        $existingUtl = $tournament->getUtlOfUser($user);
        if ($existingUtl) {
            throw new JsonException("המשתמש כבר רשום לטורניר זה", 400);
        }

        $utl  = $tournament->createUTL($user, $name);

        return new UtlResource($utl);
    }

    public function getOwnedTournaments(Request $request)
    {
        $tournaments = $this->getUser()->ownedTournaments;
        return new JsonResponse($tournaments, 200);
    }

    public function getTournamentUTLs(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->utls
            ->filter(fn($utl) => $utl->isCompeting())
            ->map(
                fn(TournamentUser $utl) => (new ContestantResource($utl))->toArray($request)
            )
            ->keyBy("id");

        return new JsonResponse($data, 200);
    }

    public function setPassword(Request $request){
        $user = Auth::user();
        $id = $user->id;
        $validated = $request->validate([
            'new_password' => 'required|string|min:4|confirmed'
        ]);
        $password = $request->new_password;
        $user->password = Hash::make($password);
        $user->save();
        return response()->json(200);
    }
}
