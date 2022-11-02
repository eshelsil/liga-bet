<?php

namespace App\Http\Controllers;

use App\Http\Validations\EnsureTournamentAdmin;
use App\Tournament;
use App\TournamentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\JsonException;

class TournamentUserController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {

        $tournament = Tournament::find($tournamentId);
        $utls = $tournament->utls
            ->filter(fn($utl) => $utl->isRegistered());
        return new JsonResponse($utls, 200);
    }

    public function update(Request $request, string $tournamentId, string $utlId)
    {
        $role = $request->role;
        if ( !in_array($role, [TournamentUser::ROLE_MANAGER, TournamentUser::ROLE_CONTESTANT]) ){
            throw new JsonException("Got unsupported role \"$role\". The only roles allowed to be set are [".TournamentUser::ROLE_MANAGER.", ".TournamentUser::ROLE_CONTESTANT."]", 400);
        }
        $utl = $this->getUTL($tournamentId, $utlId);
        if ($utl->hasManagerPermissions() || $role == TournamentUser::ROLE_MANAGER){
            $this->validateCanUpdateManagers($tournamentId);
        }
        if ($role !== $utl->role){
            if ($role == TournamentUser::ROLE_CONTESTANT && $utl->role == TournamentUser::ROLE_NOT_CONFIRMED){
                $this->validateCanConfirmUser($utl);
            } else if ($role == TournamentUser::ROLE_CONTESTANT && $utl->role == TournamentUser::ROLE_MANAGER) {
                $this->validateCanRevokeManagerPermissions($utl);
            } else if ($role == TournamentUser::ROLE_MANAGER && $utl->role == TournamentUser::ROLE_CONTESTANT) {
                $this->validateCanMakeManager($utl);
            } else {
                throw new JsonException("Cannot update UTL with role $utl->role to have role ".$role, 400);
            }
            $utl->role = $role;
            $utl->save(); 
        }
        return new JsonResponse($utl, 200);
    }
    
    public function delete(Request $request, string $tournamentId, $utlId)
    {
        $utl = $this->getUTL($tournamentId, $utlId);
        if ($utl->hasManagerPermissions()){
            $this->validateCanUpdateManagers($tournamentId);
        }
        if ($utl->isAdmin()){
            throw new JsonException("אי אפשר למחוק את מנהל הטורניר", 403);
        }
        $tournament = $utl->tournament;
        if ($tournament->hasStarted()){
            throw new JsonException("לא ניתן למחוק משתתף אחרי שהטורניר כבר התחיל", 403);
        }
        $utl->role = TournamentUser::ROLE_REJECTED;
        $utl->save();
        return new JsonResponse([], 200);
    }

    private function getUTL($tournamentId, $utlId){
        $utl = TournamentUser::find($utlId);
        if (!$utl || $utl->tournament_id != $tournamentId) {
            throw new JsonException("UTL with id $utlId was not found on tournament $tournamentId", 404);
        }
        return $utl;
    }

    private function validateCanUpdateManagers(int $tournamentId)
    {
        EnsureTournamentAdmin::validate(Auth::user(), $tournamentId);
    }

    private function validateCanRevokeManagerPermissions(TournamentUser $utl)
    {
        return true;
    }

    private function validateCanConfirmUser(TournamentUser $utl)
    {
        $CONTESTNATS_PER_TOURNAMENT_LIMIT = 40;
        if ($utl->tournament->confirmedUtls()->count() >= $CONTESTNATS_PER_TOURNAMENT_LIMIT){
            throw new JsonException("לא ניתן לאשר את המתחרה \"".$utl->name."\". מספר המשתתפים בטורניר מוגבל ל-$CONTESTNATS_PER_TOURNAMENT_LIMIT משתתפים", 400);
        }
        return true;

    }

    private function validateCanMakeManager(TournamentUser $utl)
    {
        return true;
    }
}
