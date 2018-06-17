<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetGame\BetGame;
use App\Bets\BetGame\BetGameRequest;
use App\Enums\BetTypes;
use App\Match;
use App\Team;
use App\User;
use App\Exceptions\JsonException;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Psr\Log\InvalidArgumentException;

class APIController extends Controller
{
    private $user = null;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('auth');
    }

    /**
     * @return User
     * @throws JsonException
     */
    private function getUser(){
        $request = Request::instance();
        $this->user = $this->user ?: Auth::user() ?: User::where("id", "=", $request->get("id"))
                          ->where("remember_token", "=", $request->get("remember"))
                          ->first();

        if (!$this->user) {
            throw new JsonException("לא מאומת", 403);
        }

        return $this->user;
    }

    public function validateCredentials() {
        $this->getUser();

        return new JsonResponse(["status" => 0], 200);
    }

    /**
     * Return Matches with no user's bet
     *
     * @return \Illuminate\Http\Response
     */
    public function getOpenMatches()
    {
        $user = $this->getUser();

        $matches = $user->getOpenMatches();

        $teams = Team::all();

        $matches->each(function ($match) use ($teams) {
            $match->team_home_name = $teams->first(function($team) use ($match) { return $team->id == $match->team_home_id; })->name;
            $match->team_away_name = $teams->first(function($team) use ($match) { return $team->id == $match->team_away_id; })->name;
        });

        return response($matches->groupBy(["type", "sub_type"])->toJson());
    }

    public function submitBets()
    {
        $user = $this->getUser();
        $betsInput = Request::json("bets", []);


        $this->validateBatch($betsInput);

        foreach ($betsInput as $betInput) {
            switch ($betInput->type) {
                case BetTypes::Game:
                    $betRequest = new BetGameRequest(Match::query()->find($betsInput->type_id), $betsInput->data);
                    $bet = BetGame::save($user, $betRequest);
                    break;
                default:
                    throw new InvalidArgumentException();
            }
        }

    }

    private function validateBatch($betsInput) {
        // Validate no duplicates
        $betsTypeGrouped = [];
        foreach ($betsInput as $bet) {
            if (!isset($betsTypeGrouped[$bet->type])) {
                $betsTypeGrouped[$bet->type] = [];
            }

            if (in_array($bet->data->type_id, $betsTypeGrouped[$bet->type])) {
                throw new JsonException("משחק {$bet->data->type_id} נשלח פעמיים");
            }

            $betsTypeGrouped[$bet->type][] = $bet->data->type_id;
        }

        // Validate all games has teams and no scores
        if (isset($betsTypeGrouped[BetTypes::Game])) {
            $notAllowedMatches = Match::query()->whereIn("id", $betsTypeGrouped[BetTypes::Game])
                ->where(function(\Illuminate\Database\Eloquent\Builder $q) {
                    $q->whereNull("team_home_id")
                      ->orWhereNull("team_away_id")
                      ->orWhereNotNull("result_home")
                      ->orWhereNotNull("result_away");
                })->get();

            if ($notAllowedMatches->isNotEmpty()) {
                throw new JsonException("משחקים ({$notAllowedMatches->implode("id", ", ")} לא יכולים להשלח", 201);
            }
        }


        // Check if one of the bets already set for this user by type+type_id
        $alreadySubmittedBets = Bet::query()
            ->where("user_id", "=", $this->getUser()->id)
            ->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($betsTypeGrouped) {
                foreach ($betsTypeGrouped as $type => $ids) {
                    $q->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($type, $ids) {
                        $q->where("type", "=", $type)
                          ->whereIn("type_id", $ids);
                    });
                }
            })->get();

        if ($alreadySubmittedBets->isNotEmpty()) {
            throw new JsonException("משחקים ({$alreadySubmittedBets->implode("id", ", ")} כבר הוזנו", 201);
        }


    }
}
