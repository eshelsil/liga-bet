<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 13/11/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Exceptions\JsonException;
use App\Tournament;
use App\TournamentPreferences;
use App\User;
use Illuminate\Support\Str;

class CreateTournament
{
    public function __construct(protected CreateTournamentSpecialBets $ctsb)
    { }

    public function handle(User $user, Competition $competition, string $name): Tournament
    {
        $this->validateCreatePermissions($user);
        $this->validateCreateLimitations($user);
        $this->validateNameAlreadyInUse($name);

        $tournament                  = new Tournament();
        $tournament->name            = $name;
        $tournament->status          = Tournament::STATUS_INITIAL;
        $tournament->config          = ["scores" => config('defaultScore'), "prizes" => []];
        $tournament->competition_id  = $competition->id;
        $tournament->code            = Str::lower(Str::random(6));
        $tournament->creator_user_id = $user->id;
        $tournament->save();

        $this->ctsb->handle($tournament);

        $tournamentPreferences                  = new TournamentPreferences();
        $tournamentPreferences->tournament_id   = $tournament->id;
        $tournamentPreferences->save();

        return $tournament;
    }

    private function validateCreatePermissions(User $user)
    {
        return ;
        // $user = $this->getUser();
        // if (! $user->hasTournamentAdminPermissions()) {
        //     throw new JsonException("אין לך את ההרשאות הדרושות כדי לפתוח טורניר משלך", 401);
        // }

        // if ($user->isTournamentAdmin()) {
        //     if ($user->ownedTournaments()->count() > 0) {
        //         throw new JsonException("לא ניתן לפתוח יותר מטורניר אחד", 401);
        //     }
        // }
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

    /**
     * @param string $name
     *
     * @return void
     * @throws JsonException
     */
    protected function validateNameAlreadyInUse(string $name): void
    {
        if (Tournament::where('name', $name)->exists()) {
            throw new JsonException("קיים כבר טורניר עם השם \"$name\"", 400);
        }
    }
}