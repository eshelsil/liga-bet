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
use App\Game;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Database\Eloquent\Collection;

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
        $isQualifierBetOn = data_get($tournamentUser->tournament->config, "scores.gameBets.knockout.qualifier");
        $koWinnerSide = null;
        if ($game->isKnockout() && $isQualifierBetOn && $otherLegGame = $game->getOtherLegGame()) {
            if ($otherLegGameBet = $tournamentUser->bets()->where(["type" => BetTypes::Game, "type_id" => $otherLegGame->id])->first()){
                if ($alreadyBettedKoWinnerSide = $otherLegGameBet->getKoWinnerSide()) {
                    $alreadyBettedKoWinner = $alreadyBettedKoWinnerSide === "home" ? $otherLegGame->team_home_id : $otherLegGame->team_away_id;
                    $koWinnerSide = $game->team_home_id == $alreadyBettedKoWinner ? "home" : "away";
                }
            }
        }

        $bet = new Bet();
        $bet->user_tournament_id = $tournamentUser->id;
        $bet->tournament_id = $tournamentUser->tournament->id;
        $bet->type = BetTypes::Game;
        $bet->type_id = $game->getID();
        $bet->data = $game->generateRandomBetData($isQualifierBetOn, $koWinnerSide);
        $bet->save();
    }
}