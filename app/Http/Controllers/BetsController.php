<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Bets\BetGroupsRank\BetGroupRankRequest;
use App\Bets\BetGroupsRank\BetGroupRank;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Bets\BetSpecialBets\BetSpecialBets;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Http\Resources\GroupResource;
use App\Team;
use App\User;
use App\Group;
use App\Player;
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

    public function validateCredentials() {
        $this->getUser();

        return new JsonResponse(["status" => 0], 200);
    }

    public function index(\Illuminate\Http\Request $request, $tournamentId)
    {
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        $competition = $utl->tournament->competition;

        $bets = $utl->bets;
        $formattedBets = $this->formatBets($bets, $competition, $request);

        return new JsonResponse($formattedBets->keyBy('id'), 200);
    }

    public function openGames(\Illuminate\Http\Request $request, $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        $tournament = $utl->tournament;

        $openGameIds = $tournament->competition
            ->games()
            ->where("start_time", "<", time() + config("bets.lockBeforeSeconds"))
            ->pluck("id");

        $bets = Bet::query()
            ->where("tournament_id", $tournament->id)
            ->where("type", BetTypes::Game)
            ->whereIn("type_id", $openGameIds)
            ->get();

        $formattedBets = $this->formatBets($bets, $tournament->competition, $request);

        return new JsonResponse($formattedBets->keyBy('id'), 200);
    }

    public function submitBets($tournamentId)
    {
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        $betsInput = Request::json("bets", []);

        $this->validateBatch($betsInput, $utl);

        $bets = [];
        foreach ($betsInput as $betInput) {
            $betInput = (object)$betInput;
            switch ($betInput->type) {
                case BetTypes::Game:
                    $betRequest = new BetMatchRequest(
                        Game::query()->find($betInput->data["type_id"]),
                        $betInput->data
                    );
                    $bets[] = BetMatch::save($utl, $betRequest);
                    break;
                case BetTypes::GroupsRank:
                    if (!$utl->tournament->competition->areBetsOpen()){
                        throw new \InvalidArgumentException("GroupRank bets are closed. cannot update bet");
                    }
                    $betRequest = new BetGroupRankRequest(
                        Group::find($betInput->data["type_id"]),
                        $betInput->data["value"]
                    );
                    $bets[] = BetGroupRank::save($utl, $betRequest);
                    break;
                case BetTypes::SpecialBet:
                    $betValue = ["answer" => $betInput->data["answer"]];
                    $utlData = ["utl" => $utl];
                    $betRequestData = array_merge($betValue, $utlData);
                    $betRequest = new BetSpecialBetsRequest(
                        SpecialBet::find($betInput->data["type_id"]),
                        $betRequestData
                    );
                    $bets[] = BetSpecialBets::save($utl, $betRequest);
                    break;
                default:
                    throw new InvalidArgumentException();
            }
        }
        $formattedBets = (new Collection($bets))->map(function (Bet $bet) {
            return $bet->export_data();
        });

        return new JsonResponse(["bets" => $formattedBets->keyBy('id')], 200);

    }

    private function validateBatch($betsInput, $utl) {
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
        if (isset($betsTypeGrouped[BetTypes::Game])) {
            $notAllowedMatches = Game::query()->whereIn("id", $betsTypeGrouped[BetTypes::Game])
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
            ->where("user_tournament_id", "=", $utl->id)
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

    protected function formatBets(
        \Illuminate\Database\Eloquent\Collection $bets,
        Competition $competition,
        \Illuminate\Http\Request $request
    ): Collection {
        $betsByType    = $bets->groupBy("type");
        $formattedBets = collect();
        foreach ($betsByType as $type => $bets) {
            if ($type == BetTypes::GroupsRank) {
                $formattedBets = $this->formatGroupRank($competition, $bets, $request, $formattedBets);
            } elseif ($type == BetTypes::Game) {
                $formattedBets = $this->formatGameBets($competition, $bets, $formattedBets);
            } else {
                foreach ($bets as $bet) {
                    $formattedBets[] = $bet->export_data();
                }
            }
        }

        return $formattedBets;
    }


    protected function formatGroupRank(
        Competition $competition,
        \Illuminate\Database\Eloquent\Collection $bets,
        \Illuminate\Http\Request $request,
        Collection $formattedBets
    ): Collection {
        $groups = $competition->groups->keyBy("id");
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            /** @var Group $group */
            $group = $groups->get($bet->type_id);
            $teams = $group->teams->keyBy("id");

            $standings = collect($bet->getData())->sortKeys()
                 ->map(function ($teamId) use ($group, $teams) {
                     return $teams->get($teamId)
                          ->only([
                              "name",
                              "id",
                              "crest_url"
                          ]);
                 })->values();

            $formattedBets[] = $bet->export_data() + [
                    "standings"    => $standings,
                    "relatedGroup" => (new GroupResource($group))->toArray($request)
                ];
        }

        return $formattedBets;
    }

    protected function formatGameBets(
        Competition $competition,
        \Illuminate\Database\Eloquent\Collection $bets,
        Collection $formattedBets
    ): Collection {
        $games = $competition->games->whereIn("id", $bets->pluck("type_id"))->keyBy("id");
        $teams = $competition->teams->keyBy("id");
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            /** @var Game $game */
            $game = $games->get($bet->type_id);

            $formattedBets[] = $bet->export_data() + [
                    "relatedMatch" => [
                        "home_team" => $teams->get($game->team_home_id)
                                             ->only([
                                                 "id",
                                                 "name",
                                                 "crest_url"
                                             ]),
                        "away_team" => $teams->get($game->team_home_id)
                                             ->only([
                                                 "id",
                                                 "name",
                                                 "crest_url"
                                             ]),
                        "result_home" => $game->result_home,
                        "result_away" => $game->result_away,
                        "winner_side" => $game->getWinnerSide(),
                        "id" => $game->id,
                    ]
                ];
        }

        return $formattedBets;
    }
}
