<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Enums\WinnerSide;
use App\Game;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Database\Eloquent\Collection;
use App\SpecialBets\SpecialBet;

class MonkeyAutoBetCompetitionGames
{

    public function handle(User $user, Game $game)
    {
        if (!$user->isMonkey()){
            throw new \InvalidArgumentException("Cannot auto-generate bets for a user who is not a monkey");
        }

        $user->loadMissing("utls.tournament");
        $tournamentUsers = $user->utls
            ->where("tournament.competition_id", $game->competition_id);

        $tournamentUsers->loadMissing(["bets" => function ($query) {
            $query->where('type', BetTypes::Game);
        }]);

        $tournamentUsers->each(fn (TournamentUser $tournamentUser) => $this->betTournament($game, $tournamentUser));
    }

    public function betTournament(Game $game, TournamentUser $tournamentUser)
    {
        if ($tournamentUser->bets->firstWhere("game_id", $game->id)) {
            return;
        }
        $tournament = $tournamentUser->tournament;

        if ($tournament->isKnockoutBracket()) {
            if (!$game->isKnockout()) {
                return; // monkeys never bet group-stage games in bracket tournaments
            }
            $winnerSb = SpecialBet::getByType($tournament->id, SpecialBet::TYPE_WINNER);
            $runnerSb = SpecialBet::getByType($tournament->id, SpecialBet::TYPE_RUNNER_UP);
            $picks = $tournamentUser->getWinnerAndRunnerUpTeams($winnerSb?->id, $runnerSb?->id);
            $this->betBracketGame($game, $tournamentUser, $picks);
            return;
        }

        $isQualifierBetOn = data_get($tournament->config, "scores.gameBets.knockout.qualifier");
        $koWinnerSide = null;
        if ($game->isKnockout() && $isQualifierBetOn && $otherLegGame = $game->getOtherLegGame()) {
            if ($otherLegGameBet = $tournamentUser->bets()->where(["type" => BetTypes::Game, "type_id" => $otherLegGame->id])->first()){
                if ($alreadyBettedKoWinnerSide = $otherLegGameBet->getKoWinnerSide()) {
                    $alreadyBettedKoWinner = $alreadyBettedKoWinnerSide === "home" ? $otherLegGame->team_home_id : $otherLegGame->team_away_id;
                    $koWinnerSide = $game->team_home_id == $alreadyBettedKoWinner ? WinnerSide::HOME : WinnerSide::AWAY;
                }
            }
        }

        $bet = new Bet();
        $bet->user_tournament_id = $tournamentUser->id;
        $bet->tournament_id = $tournament->id;
        $bet->type = BetTypes::Game;
        $bet->type_id = $game->getID();
        $bet->data = $game->generateRandomBetData($isQualifierBetOn, $koWinnerSide);
        $bet->save();
    }

    /**
     * Auto-bet a single knockout game for a monkey in a knockout-bracket tournament: back the monkey's
     * Winner/Runner-Up side when that team plays (Winner first), otherwise a random side. Always a
     * decisive result + qualifier, for both qualifier-only and result-bet tournaments.
     */
    private function betBracketGame(Game $game, TournamentUser $tournamentUser, $picks): void
    {
        $desiredSide = null;
        foreach ([$picks->get('winner'), $picks->get('runner_up')] as $teamId) {
            if (!$teamId) {
                continue;
            }
            if ($game->team_home_id === $teamId) {
                $desiredSide = WinnerSide::HOME;
                break;
            }
            if ($game->team_away_id === $teamId) {
                $desiredSide = WinnerSide::AWAY;
                break;
            }
        }

        $bet = new Bet();
        $bet->user_tournament_id = $tournamentUser->id;
        $bet->tournament_id = $tournamentUser->tournament_id;
        $bet->type = BetTypes::Game;
        $bet->type_id = $game->getID();
        $bet->data = $game->generateRandomBetData(true, $desiredSide);
        $bet->save();
    }
}