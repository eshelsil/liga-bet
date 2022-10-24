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
use App\Exceptions\JsonException;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;

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

    public function updateUTL(Request $request, string $tournamentId){
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("משתמש לא קיים", 404);
        }
        $name = $request->name;
        $validated = $request->validate([
            'name' => 'string|min:2'
        ]);

        $contestantWithSameName = $utl->tournament->utls->where('name', $name)->first();
        if ($contestantWithSameName && $contestantWithSameName->id !== $utl->id){
            throw new JsonException("בטורניר זה כבר קיים משתמש עם השם \"$name\"", 400);
        }
        $utl->name = $name;
        $utl->save();
        return (new UtlResource($utl))->toArray($request);
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
        if ( !$tournament) {
            throw new JsonException("לא נמצא טורניר עם הקוד $tournamentCode", 400);
        }

        $user        = Auth::user();
        $existingUtl = $tournament->getUtlOfUser($user);
        if ($existingUtl) {
            throw new JsonException("המשתמש כבר רשום לטורניר זה", 400);
        }
        if (!$user->isAdmin()){
            $MAX_TOURNAMENTS_PER_USER_LIMIT = 3;
            if ($user->registeredUtls()->count() >= $MAX_TOURNAMENTS_PER_USER_LIMIT){
                throw new JsonException("המשתמש כבר רשום ל-3 טורנירים, לא ניתן להצטרף לטורניר נוסף", 400);
            }
        }

        $utl  = $tournament->createUTL($user, $name);

        return (new UtlResource($utl))->toArray($request);
    }

    public function leaveTournament(Request $request, string $tournamentId)
    {
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 400);
        }
        if (!$utl->isRejected() && !$utl->isNotConfirmed()){
            throw new JsonException("אינך יכול לעזוב את הטורניר לאחר שאושרת בידי אחד ממנהלי הטורניר", 400);
        }
        $utl->delete();
        return new JsonResponse(null, 200);
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



    // Manage Users:

    public function index(Request $request)
    {
        $roles = $request->roles;
        $search = $request->search;
        $limit = $request->limit;
        $offset = $request->offset;
        $fileredQuery = User::query()
            ->when($roles, function($q) use ($roles) {
                return $q->whereIn('permissions', $roles);
            })
            ->when(!$roles, fn($q) =>
                $q->where('permissions', '>=', 0)
            )
            ->when($search, function($q) use ($search) {
                $searchLike = '%'.$search.'%';
                return $q->where(function($q) use ($searchLike){
                    return $q->where('username', 'like', $searchLike)
                        ->orWhere('name', 'like', $searchLike);
                });
            });
        $total = $fileredQuery->count();
        $users = $fileredQuery
            ->when($limit, function($q) use ($limit) {
                return $q->take($limit);
            })
            ->when($offset, function($q) use ($offset) {
                return $q->skip($offset);
            })
            ->get();
        $data = $users->map(
            fn(User $user) => (new UserResource($user))->toArray($request)
        );
        return (new JsonResponse($data, 200, [
            'X-Total-Count' => $total
        ]));
    }

    public function update(Request $request, string $userId)
    {
        $user = User::find($userId);
        if (!$user){
            throw new JsonException("User with id $userId does not exist", 400);
        }
        $hasNewPermissions = $request->exists('permissions');
        $hasNewCanEditScoresAttr = $request->exists('canEditScores');
        if ($hasNewPermissions){
            $newPermissions = $request->permissions;
            $this->validateNewPermissions($newPermissions, $user);
            $user->permissions = $newPermissions;
        }
        if ($hasNewCanEditScoresAttr){
            $canEditScores = $request->canEditScores;
            $this->validateCanEditScoreInput($canEditScores, $user);
            $user->can_edit_score_config = $canEditScores;
        }
        if (!$hasNewPermissions && !$hasNewCanEditScoresAttr){
            throw new JsonException("Got no configurable parameters. must pass at least one of: \"permissions\", \"canEditScores\" ", 400);
        }
        $user->save(); 
        return new JsonResponse((new UserResource($user))->toArray($request), 200);
    }

    public function validateCanEditScoreInput(bool $canEditScores, User $user)
    {
        $validator = Validator::make(["canEditScores" => $canEditScores], [
            'canEditScores' => 'required|boolean',
        ])->validate();
        if ($user->permissions != User::TYPE_TOURNAMENT_ADMIN){
            throw new JsonException("Failed trying updating can_", 400);
        }
    }

    public function validateNewPermissions(int $newPermissions, User $user)
    {
        if ( !in_array($newPermissions, [User::TYPE_TOURNAMENT_ADMIN, User::TYPE_USER]) ){
            throw new JsonException("Got unsupported permissions type \"$newPermissions\". The only permissions types allowed to be set are [".User::TYPE_TOURNAMENT_ADMIN.", ".User::TYPE_USER."]", 400);
        }
        $permissions = $user->permissions;
        if ($newPermissions == User::TYPE_TOURNAMENT_ADMIN){
            if ($permissions == User::TYPE_USER){
                $this->ensureCanGrantTournamentAdminPermissions();
            } else {
                throw new JsonException("Only users with TYPE_USER permissions can become tournament-admin", 400);
            }
        }
        if ($newPermissions == User::TYPE_USER){
            if ($permissions == User::TYPE_TOURNAMENT_ADMIN){
                $this->ensureCanRemoveTournametAdminPermissions($user);
            } else {
                throw new JsonException("Only users with TYPE_TOURNAMENT_ADMIN permissions can become a regular-user", 400);
            }
        }
    }

    private function ensureCanRemoveTournametAdminPermissions(User $user){
        $ownedTournaments = $user->ownedTournaments();
        if ($ownedTournaments->count() > 0){
            throw new JsonException("User \"$user->username\" (id: $user->id) has already created a tournament", 400);
        }
    }

    private function ensureCanGrantTournamentAdminPermissions(){
        if (User::where('permissions', User::TYPE_TOURNAMENT_ADMIN)->count() >= 40){
            throw new JsonException("Cannot have more than 40 tournament-admins", 403);
        }
    }
}
