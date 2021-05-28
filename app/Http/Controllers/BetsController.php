<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Bets\BetGroupRank\BetGroupRank;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Bets\BetSpecialBets\BetSpecialBets;
use App\Enums\BetTypes;
use App\Match;
use App\Team;
use App\User;
use App\Group;
use App\Scorer;
use App\SpecialBets\SpecialBet;
use App\Exceptions\JsonException;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Psr\Log\InvalidArgumentException;

class BetsController extends Controller
{
    private $user = null;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
       $this->middleware('auth');
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

    public function submitBets()
    {
        $user = $this->getUser();
        $betsInput = Request::json("bets", []);

        $this->validateBatch($betsInput);

        $bets = [];
        foreach ($betsInput as $betInput) {
            $betInput = (object)$betInput;
            switch ($betInput->type) {
                case BetTypes::Match:
                    $betRequest = new BetMatchRequest(
                        Match::query()->find($betInput->data["type_id"]),
                        $betInput->data
                    );
                    $bets[] = BetMatch::save($user, $betRequest);
                    break;
                case BetTypes::GroupsRank:
                    $betRequest = new BetGroupRankRequest(
                        Group::find($betInput->data["type_id"]),
                        $betInput->data["value"]
                    );
                    $bets[] = BetGroupRank::save($user, $betRequest);
                    break;
                case BetTypes::SpecialBet:
                    $top_scorer_type_id = SpecialBet::getBetTypeIdByName('top_scorer');
                    $betValue = $betInput->data["value"];
                    $userData = ["user" => $user];
                    $betRequestData = array_merge($betValue, $userData);
                    $betRequest = new BetSpecialBetsRequest(
                        SpecialBet::find($betInput->data["type_id"]),
                        $betRequestData
                    );
                    $bets[] = BetSpecialBets::save($user, $betRequest);
                    break;
                default:
                    throw new InvalidArgumentException();
            }
        }

        return new JsonResponse(["bets" =>$bets], 200);

    }

    private function validateBatch($betsInput) {
        // Validate no duplicates
        $betsTypeGrouped = [];
        foreach ($betsInput as $bet) {
            $bet = (object)$bet;
            if (!isset($bet->type) || !isset($bet->data) || !isset($bet->data["type_id"])) {
                throw new JsonException("מבנה הימור לא תקין");
            }
            if (!isset($betsTypeGrouped[$bet->type])) {
                $betsTypeGrouped[$bet->type] = [];
            }

            if (in_array($bet->data["type_id"], $betsTypeGrouped[$bet->type])) {
                throw new JsonException("משחק {$bet->data["type_id"]} נשלח פעמיים");
            }

            $betsTypeGrouped[$bet->type][] = $bet->data["type_id"];
        }

        // Validate all Matchs has teams and no scores
        if (isset($betsTypeGrouped[BetTypes::Match])) {
            $notAllowedMatches = Match::query()->whereIn("id", $betsTypeGrouped[BetTypes::Match])
                ->where(function(\Illuminate\Database\Eloquent\Builder $q) {
                    $q->whereNull("team_home_id")
                      ->orWhereNull("team_away_id")
                      ->orWhereNotNull("result_home")
                      ->orWhereNotNull("result_away")
                      ->orWhere("start_time", "<", time() + config("bets.lockBeforeSeconds"));
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
//            throw new JsonException("משחקים ({$alreadySubmittedBets->implode("type_id", ", ")} כבר הוזנו", 201);
        }


    }
}
