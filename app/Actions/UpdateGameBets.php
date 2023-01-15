<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Bets\BetMatch\BetMatchRequest;
use App\Game;
use Illuminate\Support\Facades\Log;

class UpdateGameBets
{
    public function handle(Game $game, $scoreHome = null, $scoreAway = null, $isAwayWinner = null)
    {
        $this->saveScore($scoreHome, $scoreAway, $game, $isAwayWinner);

        Log::debug("Game Home ({$game->teamHome->name}): {$game->result_home} | Away ({$game->teamAway->name}): {$game->result_away}");

        /** @var Bet $bet */
        foreach ($game->getBets()->load("tournament") as $bet) {
            if (config("test.onlyTournamentId") && config("test.onlyTournamentId") != $bet->tournament->id) {
                continue;
            }

            $betRequest = $this->getBetRequest($game, $bet);

            $bet->score = $betRequest->calculate();
            $bet->save();

            Log::debug( "User: {$bet->utl->user->name} Bet ID [{$bet->id}] home: {$bet->getData("result-home")} Bet away: {$bet->getData("result-away")} Score: {$bet->score}");
        }

        return "FINISHED";
    }

    public function calculateBets(Game $game)
    {

        /** @var Bet $bet */
        foreach ($game->getBets() as $bet) {

            $betRequest = $this->getBetRequest($game, $bet);

            $bet->score = $betRequest->calculate();
            $bet->save();

            Log::debug( "User: {$bet->utl->user->name} Bet ID [{$bet->id}] home: {$bet->getData("result-home")} Bet away: {$bet->getData("result-away")} Score: {$bet->score}");
        }

        return "FINISHED";
    }

    /**
     * @param mixed $scoreHome
     * @param mixed $scoreAway
     * @param Game  $game
     * @param mixed $isAwayWinner
     *
     * @return void
     */
    protected function saveScore(
        mixed $scoreHome,
        mixed $scoreAway,
        Game $game,
        mixed $isAwayWinner
    ): void {
        if ( ! is_null($scoreHome) && ! is_null($scoreAway)) {
            if ($game->isKnockout()) {
                if ($scoreHome > $scoreAway) {
                    $game->ko_winner = $game->team_home_id;
                } elseif ($scoreHome < $scoreAway) {
                    $game->ko_winner = $game->team_away_id;
                } elseif ($isAwayWinner) {
                    $game->ko_winner = $game->team_away_id;
                } else {
                    $game->ko_winner = $game->team_home_id;
                }
            }
            $game->result_home = $scoreHome;
            $game->result_away = $scoreAway;
            $game->save();
        }
    }

    /**
     * @param Game $game
     * @param Bet  $bet
     *
     * @return BetMatchRequest
     */
    protected function getBetRequest(Game $game, Bet $bet): BetMatchRequest
    {
        return new BetMatchRequest($game, $bet->tournament, [
            "result-home" => $bet->getData("result-home"),
            "result-away" => $bet->getData("result-away"),
            "winner_side" => $bet->getData("ko_winner_side"),
        ]);
    }
}