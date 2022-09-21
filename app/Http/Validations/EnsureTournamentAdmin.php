<?php

namespace App\Http\Validations;

use App\User;
use App\Exceptions\JsonException;

class EnsureTournamentAdmin
{
    /**
     * Throw error if current user is not the admin of the tournament
     *
     * @param  User $user
     * @param  int $tournamentId
     * @return mixed
     */
    static function validate(User $user, int $tournamentId)
    {
        $utl = $user->getTournamentUser($tournamentId);
        if (!$utl || !$utl->isAdmin()) {
            throw new JsonException("This resource is available only for the tournament admin", 403);
        }
    }
}
