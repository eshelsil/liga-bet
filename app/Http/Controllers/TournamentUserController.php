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
        $utls = $tournament->utls;
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
        if ($role == TournamentUser::ROLE_CONTESTANT){
            $this->validateCanSetContestant($utl);
        }
        if ($role == TournamentUser::ROLE_MANAGER) {
            $this->validateCanMakeManager($utl);
        }
        $utl->role = $role;
        $utl->save(); 
        return new JsonResponse($utl, 200);
    }
    
    public function delete(Request $request, string $tournamentId, $utlId)
    {
        $utl = $this->getUTL($tournamentId, $utlId);
        if ($utl->hasManagerPermissions()){
            $this->validateCanUpdateManagers($tournamentId);
        }
        if ($utl->isConfirmed()){
            throw new JsonException("לא ניתן למחוק משתמש שאושר", 400);
        }
        $utl->delete();
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

    private function validateCanSetContestant(TournamentUser $utl)
    {
        if ($utl->isNotConfirmed() || $utl->isContestant() || $utl->isManager()){
            return true;
        }
        throw new JsonException("Cannot update UTL with role $utl->role to have role ".TournamentUser::ROLE_CONTESTANT, 400);

    }

    private function validateCanMakeManager(TournamentUser $utl)
    {
        if ($utl->isManager() || $utl->isContestant()){
            return true;
        }
        throw new JsonException("Cannot update UTL with role $utl->role to have role ".TournamentUser::ROLE_MANAGER, 400);
    }
}
