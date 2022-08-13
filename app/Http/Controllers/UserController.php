<?php

namespace App\Http\Controllers;

use App\Http\Resources\UtlResource;
use App\TournamentUser;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

    public function getTournamentUTLs(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        $data = $utl->tournament->utls
            ->map(
                fn(TournamentUser $utl) => (new UtlResource($utl))->toArray($request)
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
