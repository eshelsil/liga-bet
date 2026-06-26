<?php

namespace App\Http\Controllers;

use App\Actions\ApplyBracketSpecialBetQualifiers;
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
use App\TournamentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
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
    public function visibleGameBets(\Illuminate\Http\Request $request, $tournamentId)
    {
        $utl_ids_param = json_decode($request->input('utl_ids'));
        $game_ids_param = json_decode($request->input('game_ids'));
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        $tournament = $utl->tournament;

        $gamesColsedForBetsIds = $tournament->competition
            ->games->filter(fn($game) => !$game->isOpenForBets())
            ->pluck("id");

        $bets = Bet::query()
            ->where("tournament_id", $tournament->id)
            ->where("type", BetTypes::Game)
            ->where(function (Builder $q) use($gamesColsedForBetsIds, $utl) {
                $q->whereIn("type_id", $gamesColsedForBetsIds)
                ->orWhere('user_tournament_id', $utl->id);
            })
            ->when($utl_ids_param, function(Builder $q) use ($utl_ids_param) {
                return $q->whereIn('user_tournament_id', $utl_ids_param);
            })
            ->when($game_ids_param, function(Builder $q) use ($game_ids_param) {
                return $q->whereIn('type_id', $game_ids_param);
            })
            ->get();

        $formattedBets = $this->formatBets($bets, $tournament->competition, $request);

        return new JsonResponse($formattedBets->keyBy('id'), 200);
    }

    public function visiblePrimalBets(\Illuminate\Http\Request $request, $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        $tournament = $utl->tournament;
        $areBetsOpen = $tournament->areBetsOpen();

        $bets = Bet::query()
            ->where("tournament_id", $tournament->id)
            ->whereIn("type", [BetTypes::GroupsRank, BetTypes::SpecialBet])
            ->when($areBetsOpen, function($q) use ($utl) {
                $q->where('user_tournament_id', $utl->id);
            })
            ->get();

        $formattedBets = $this->formatBets($bets, $tournament->competition, $request);

        return new JsonResponse($formattedBets->keyBy('id'), 200);
    }

    public function submitBets($tournamentId)
    {
        $user = $this->getUser();
        $utl = $user->getTournamentUser($tournamentId);
        $betsInput = Request::json("bets", []);
        $fillTournaments = Request::json("fillTournaments", null);

        $utlsToFill = $fillTournaments ? $this->getTournamentsToFill($user, $fillTournaments) : collect([]);
        $utlsToSendFor = collect([$utl])->merge($utlsToFill);
        foreach ($utlsToSendFor as $utlToSendFor){
            $this->validateBatch($betsInput, $utlToSendFor);
        }

        // Bracket Winner/Runner-Up are submitted together in one request. Pre-resolve every special-bet
        // answer in this batch (special bet id => team id) so each pick validates against the *incoming*
        // counterpart rather than its stale stored value — otherwise swapping the two (winner↔runner-up)
        // trips the "same team"/same-side guards against the soon-to-be-overwritten DB value.
        $pendingSpecialAnswers = [];
        foreach ($betsInput as $bi) {
            $bi = (object) $bi;
            if ($bi->type == BetTypes::SpecialBet && isset($bi->data["type_id"], $bi->data["answer"])) {
                $pendingSpecialAnswers[(int) $bi->data["type_id"]] = (int) $bi->data["answer"];
            }
        }

        $bets = [];
        foreach ($betsInput as $betInput) {
            $betInput = (object)$betInput;
            switch ($betInput->type) {
                case BetTypes::Game:
                    $betData = $betInput->data;
                    $game = Game::query()->find($betData["type_id"]);
                    if (!$game->isOpenForBets()){
                        throw new \InvalidArgumentException("Game with id $game->id is closed for bets. cannot update bet");
                    }
                    // Validate cannot update qualifier of second-leg knockout bet:
                    if ($game->isTwoLeggedTie() && $game->isLastLeg()){
                        $resultHome = data_get($betData, "result-home");
                        $resultAway = data_get($betData, "result-away");
                        $koWinnerSide = data_get($betData, "winner_side");
                        if (!is_numeric($resultHome)) {
                            throw new \InvalidArgumentException($resultHome);
                        }
                        if (!is_numeric($resultAway)) {
                            throw new \InvalidArgumentException($resultAway);
                        }
                        if (!is_null($koWinnerSide)) {
                            throw new \InvalidArgumentException("Cannot Update qualifier on the second leg bet");
                        }
                    }
                    foreach ($utlsToSendFor as $utl ){
                        if ($utl->tournament->isKnockoutBracket()){
                            // Bracket: reject edits to games locked by the user's Winner/Runner-Up.
                            $this->assertBracketQualifierEditable($utl, $game);
                            // Qualifier-only, unless the tournament has a perfect-result tier configured —
                            // then keep the user's predicted score (absent score stays qualifier-only).
                            $resultBetOn = $utl->tournament->isResultBetOn();
                            $betRequest = new BetMatchRequest(
                                $game,
                                $utl->tournament,
                                [
                                    "result-home" => $resultBetOn ? data_get($betData, "result-home") : 0,
                                    "result-away" => $resultBetOn ? data_get($betData, "result-away") : 0,
                                    "winner_side" => data_get($betData, "winner_side"),
                                ]
                            );
                            $bets[] = BetMatch::save($utl, $betRequest);
                            continue;
                        }
                        $koWinnerSide = data_get($betData, "winner_side");
                        $otherLegBetData = null;
                        $otherLegGame = null;
                        if ($game->isTwoLeggedTie()){
                            $otherLegGame = $game->getOtherLegGame();
                            $otherLegBet = $utl->bets->first(fn(Bet $b) => $b->type == BetTypes::Game && $b->type_id == $otherLegGame->id);
                            if ($game->isLastLeg() && $otherLegBet){
                                // Get qualifier-bet from first-leg bet
                                $betData["winner_side"] = $game->getTeamSide($otherLegBet->getKoWinnerTeamId());
                            }
                            if ($game->isFirstLeg()){
                                $otherGameWinnerSide = $otherLegGame->getTeamSide($game->getTeamIdByWinnerSide($koWinnerSide));
                                if (!$otherLegBet){
                                    $otherLegBetData = ["winner_side" => $otherGameWinnerSide];
                                } else if ($otherLegBet->getKoWinnerSide() != $otherGameWinnerSide){
                                    $otherLegBetData = $otherLegBet->getData();
                                    $otherLegBetData["winner_side"] = $otherGameWinnerSide;
                                }
                            }
                        }
                        
                        $betRequest = new BetMatchRequest(
                            $game,
                            $utl->tournament,
                            $betData
                        );
                        $bets[] = BetMatch::save($utl, $betRequest);

                        if ($otherLegBetData){
                            $otherLegBetRequest = new BetMatchRequest(
                                $otherLegGame,
                                $utl->tournament,
                                $otherLegBetData
                            );
                            $bets[] = BetMatch::save($utl, $otherLegBetRequest);
                        }
                    }
                    break;
                case BetTypes::GroupsRank:
                    if ($utl->tournament->isKnockoutBracket()){
                        throw new \InvalidArgumentException("Group-rank bets are not allowed in bracket tournaments");
                    }
                    if (!$utl->tournament->areBetsOpen()){
                        throw new \InvalidArgumentException("GroupRank bets are closed. cannot update bet");
                    }
                    $group = Group::find($betInput->data["type_id"]);
                    foreach ($utlsToSendFor as $utl ){
                        $betRequest = new BetGroupRankRequest(
                            $group,
                            $utl->tournament,
                            $betInput->data["value"]
                        );
                        $bets[] = BetGroupRank::save($utl, $betRequest);
                    }
                    break;
                case BetTypes::SpecialBet:
                    if (!$utl->tournament->areBetsOpen()){
                        throw new \InvalidArgumentException("SpecialQuestion bets are closed. cannot update bet");
                    }
                    $betValue = ["answer" => $betInput->data["answer"]];
                    $utlData = ["utl" => $utl];
                    $betRequestData = array_merge($betValue, $utlData);
                    $specialBet = SpecialBet::find($betInput->data["type_id"]);
                    if ($utl->tournament->isKnockoutBracket()){
                        $this->validateBracketSpecialBet($utl, $specialBet, (int) $betInput->data["answer"], $pendingSpecialAnswers);
                    }
                    $betRequest = new BetSpecialBetsRequest(
                        $specialBet,
                        $utl->tournament,
                        $betRequestData
                    );
                    $bets[] = BetSpecialBets::save($utl, $betRequest);
                    if ($utl->tournament->isKnockoutBracket()){
                        // Propagate + lock the chosen team's qualifier across its known knockout games.
                        app(ApplyBracketSpecialBetQualifiers::class)->handle($utl, (int) $betInput->data["answer"]);
                    }
                    foreach ($utlsToFill as $utlToFill){
                        $utlData = ["utl" => $utlToFill];
                        $betRequestData = array_merge($betValue, $utlData);
                        $tournament = $utlToFill->tournament;
                        $correspondingSpecialBet = $tournament->specialBets->firstWhere("type", $specialBet->type);
                        $betRequest = new BetSpecialBetsRequest(
                            $correspondingSpecialBet,
                            $tournament,
                            $betRequestData
                        );
                        $bets[] = BetSpecialBets::save($utlToFill, $betRequest);
                    }
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

    private function getTournamentsToFill(User $user, $tournamentIds) {
        $utls = $user->utls->whereIn("tournament_id", $tournamentIds);
        $confirmedUtls = $utls->filter(fn(TournamentUser $utl) => $utl->isConfirmed());
        foreach ($tournamentIds as $id) {
            if (!$confirmedUtls->firstWhere("tournament_id", $id)){
                throw new JsonException("אין לך הרשאות לשלוח ניחושים לטורניר $id", 403);
            }
        }
        return $confirmedUtls;
    }

    private function validateBatch($betsInput, $utl) {
        // Validate no duplicates
        $betsTypeGrouped = [];
        foreach ($betsInput as $bet) {
            $bet = (object)$bet;
            if (!isset($bet->type) || !isset($bet->data) || !isset($bet->data["type_id"])) {
                throw new JsonException("מבנה ניחוש לא תקין");
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
                                     ->where(function(Builder $q) {
                    $q->whereNull("team_home_id")
                      ->orWhereNull("team_away_id")
                      ->orWhereNotNull("result_home")
                      ->orWhereNotNull("result_away")
                      ->orWhere("start_time", "<", time() + config("bets.lockBeforeSeconds"));
                })->get();

            if ($notAllowedMatches->isNotEmpty()) {
                throw new JsonException("משחקים ({$notAllowedMatches->implode("id", ", ")} לא יכולים להשלח", 400);
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

    /**
     * Bracket: reject a manual qualifier edit on a game where one of the user's (still-valid) Winner/Runner-Up
     * teams plays — that qualifier is auto-locked.
     */
    private function assertBracketQualifierEditable(TournamentUser $utl, Game $game): void
    {
        $lockedTeamIds = $this->bracketLockedTeamIds($utl->tournament_id, $utl->id);
        if ($lockedTeamIds->contains($game->team_home_id) || $lockedTeamIds->contains($game->team_away_id)) {
            throw new \InvalidArgumentException("This game is locked by your Winner/Runner-Up pick and cannot be edited");
        }
    }

    /**
     * Bracket Winner/Runner-Up validation: reject the same team for both; once the bracket is drawn reject
     * same-side picks and non-qualified teams immediately (better UX than a later removal + email).
     */
    private function validateBracketSpecialBet(TournamentUser $utl, ?SpecialBet $specialBet, int $teamId, array $pendingAnswers = []): void
    {
        if (!$specialBet || !in_array($specialBet->type, [SpecialBet::TYPE_WINNER, SpecialBet::TYPE_RUNNER_UP], true)) {
            throw new \InvalidArgumentException("Only Winner/Runner-Up special bets are allowed for bracket tournaments");
        }

        $competition = $utl->tournament->competition;
        $otherType = $specialBet->type === SpecialBet::TYPE_WINNER ? SpecialBet::TYPE_RUNNER_UP : SpecialBet::TYPE_WINNER;
        $otherSb = SpecialBet::getByType($utl->tournament_id, $otherType);
        // Prefer the counterpart's value from this same request (so a Winner↔Runner-Up swap validates
        // against the new picks); fall back to the stored bet when it isn't part of this submission.
        $otherTeamId = null;
        if ($otherSb) {
            if (array_key_exists($otherSb->id, $pendingAnswers)) {
                $otherTeamId = $pendingAnswers[$otherSb->id] ?: null;
            } else {
                $otherBet = Bet::query()
                    ->where('user_tournament_id', $utl->id)
                    ->where('type', BetTypes::SpecialBet)
                    ->where('type_id', $otherSb->id)
                    ->first();
                $otherTeamId = $otherBet ? (int) $otherBet->getAnswer() : null;
            }
        }

        if ($otherTeamId) {
            if ($otherTeamId === $teamId) {
                throw new \InvalidArgumentException("לא ניתן לבחור אותה קבוצה כזוכה וגם כסגנית");
            }
            $sideA = $competition->getBracketSide($teamId);
            $sideB = $competition->getBracketSide($otherTeamId);
            if ($sideA && $sideB && $sideA === $sideB) {
                throw new \InvalidArgumentException("הזוכה והסגנית חייבים להיות בצדדים שונים של הבראקט");
            }
        }

        // Reject a team that can no longer qualify: eliminated per the live standings, or — once the
        // bracket is fully seeded — absent from it. Same authoritative signal as the server-side removal.
        if ($competition->getNonQualifiedTeamIds()->contains($teamId)) {
            throw new \InvalidArgumentException("הקבוצה הנבחרת לא העפילה לשלב הנוקאאוט");
        }
    }

    private function bracketLockedTeamIds(int $tournamentId, int $utlId): Collection
    {
        $winnerSb = SpecialBet::getByType($tournamentId, SpecialBet::TYPE_WINNER);
        $runnerSb = SpecialBet::getByType($tournamentId, SpecialBet::TYPE_RUNNER_UP);
        $sbIds = collect([$winnerSb?->id, $runnerSb?->id])->filter();
        if ($sbIds->isEmpty()) {
            return collect();
        }
        return Bet::query()
            ->where('user_tournament_id', $utlId)
            ->where('type', BetTypes::SpecialBet)
            ->whereIn('type_id', $sbIds)
            ->get()
            ->map(fn (Bet $b) => (int) $b->getAnswer())
            ->filter()
            ->values();
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
        $bets->loadMissing("tournament");
        $lockedTeamIdsByUtl = [];
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            /** @var Game $game */
            $game = $games->get($bet->type_id);

            $formatted = $bet->export_data() + [
                    "relatedMatch" => [
                        "home_team" => $teams->get($game->team_home_id)
                                             ->only([
                                                 "id",
                                                 "name",
                                                 "crest_url"
                                             ]),
                        "away_team" => $teams->get($game->team_away_id)
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

            // Contract D — additive bracket betting fields.
            if ($bet->tournament && $bet->tournament->isKnockoutBracket()) {
                $utlId = $bet->user_tournament_id;
                if (!array_key_exists($utlId, $lockedTeamIdsByUtl)) {
                    $lockedTeamIdsByUtl[$utlId] = $this->bracketLockedTeamIds($bet->tournament_id, $utlId);
                }
                $locked = $lockedTeamIdsByUtl[$utlId];
                $formatted["bettable"] = (bool) ($game->team_home_id && $game->team_away_id && $game->isOpenForBets());
                $formatted["locked"] = $locked->contains($game->team_home_id) || $locked->contains($game->team_away_id);
                $formatted["user_qualifier_side"] = $bet->getData("ko_winner_side");
                $formatted["actual_qualifier_side"] = $game->getKnockoutWinnerSide();
            }

            $formattedBets[] = $formatted;
        }

        return $formattedBets;
    }
}
