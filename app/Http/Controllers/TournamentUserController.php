<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TournamentUserController extends Controller
{
    public function index(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);

        return $utl->tournament->utls;
    }
}
