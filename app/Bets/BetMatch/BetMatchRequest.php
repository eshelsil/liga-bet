<?php

namespace App\Bets\BetMatch;

use App\Bets\AbstractBetRequest;
use App\Bets\BetableInterface;
use App\Enums\GameSubTypes;
use App\Exceptions\JsonException;
use App\Game;
use App\Tournament;
use App\Competition;
use Illuminate\Support\Facades\Log;

class BetMatchRequest extends AbstractBetRequest
{
    protected Game $game;
    protected ?string $koWinnerSide;
    protected int $resultHome;
    protected int $resultAway;

    /**
     * BetMatchRequest constructor.
     *
     * @param Game  $game
     * @param array $data
     */
    public function __construct(BetableInterface $game, Tournament $tournament, array $data = []) {
        parent::__construct($game, $tournament, $data);
        $this->resultHome = data_get($data, "result-home");
        $this->resultAway = data_get($data, "result-away");
        $this->koWinnerSide = null;
        if ($this->game->isKnockout() ){
            $this->koWinnerSide = data_get($data, "winner_side");
        }
    }

    public function toJson() {
        return json_encode([
            "result-home" => $this->resultHome,
            "result-away" => $this->resultAway,
            "ko_winner_side" => $this->koWinnerSide,
        ], JSON_UNESCAPED_UNICODE);
    }


    protected function validateData(Game $game, $data)
    {
        if ($game->isTwoLeggedTie()){
            return $this->validateDataTwoLeggedTie($game, $data);
        }
        $resultHome = data_get($data, "result-home");
        if (!is_numeric($resultHome)) {
            throw new \InvalidArgumentException($resultHome);
        }
        $resultAway = data_get($data, "result-away");
        if (!is_numeric($resultAway)) {
            throw new \InvalidArgumentException($resultAway);
        }
        if ($game->isKnockout()){
            $koWinnerSide = data_get($data, "winner_side");
            if ((int)$resultAway == (int)$resultHome && !in_array($koWinnerSide, ["home", "away"]) && data_get($this->tournament->config, "scores.gameBets.knockout.qualifier")) {
                $paramString = is_null($koWinnerSide) ? "null" : $koWinnerSide;
                throw new \InvalidArgumentException("Knockout Bet's \"winner_side\" parameter must be one of [\"away\", \"home\"] if score is tied. <br>Got: {$paramString}");
            }
        }
    }

    protected function validateDataTwoLeggedTie(Game $game, $data)
    {
        $isQualifierBetOn = bool(data_get($this->tournament->config, "scores.gameBets.knockout.qualifier"));
        $resultHome = data_get($data, "result-home");
        $resultAway = data_get($data, "result-away");
        $koWinnerSide = data_get($data, "winner_side");
        if ($game->isKnockout() && $isQualifierBetOn && !in_array($koWinnerSide, ["home", "away"])){
            $paramString = is_null($koWinnerSide) ? "null" : $koWinnerSide;
            throw new \InvalidArgumentException("Knockout Bet's \"winner_side\" parameter must be one of [\"away\", \"home\"] if score is tied. <br>Got: {$paramString}");
        }
        if ($game->isLastLeg() && in_array($koWinnerSide, ["home", "away"]) && is_null($resultHome) && is_null($resultAway)){
            // Allow bet with qualifier and empty-result for second-leg, as it is generated automatically when betting on first-leg game - update validation should happen on API level
            return;
        }
        if (!is_numeric($resultHome)) {
            throw new \InvalidArgumentException($resultHome);
        }
        if (!is_numeric($resultAway)) {
            throw new \InvalidArgumentException($resultAway);
        }
    }

    /**
     * @return Game
     */
    public function getGame(): ?Game
    {
        return $this->game;
    }

    /**
     * @return int
     */
    public function getResultHome()
    {
        return $this->resultHome;
    }

    public function getKnockoutQualifier()
    {
        if ($this->game->isTwoLeggedTie()){
            return $this->koWinnerSide;
        }
        if ($this->resultHome > $this->resultAway){
            return "home";
        } else if ($this->resultHome < $this->resultAway){
            return "away";
        }
        return $this->koWinnerSide;
    }

    /**
     * @return int
     */
    public function getResultAway()
    {
        return $this->resultAway;
    }

    /**
     * @return int
     */
    public function calculate()
    {
        if ($this->getGame()->isKnockout()) {
            $score = $this->calculateKnockout("knockout");

            $type = match ($this->getGame()->sub_type) {
                GameSubTypes::FINAL          => "final",
                GameSubTypes::THIRD_PLACE    => "thirdPlace",
                GameSubTypes::SEMI_FINALS    => "semiFinal",
                GameSubTypes::QUARTER_FINALS => "quarterFinal",
                GameSubTypes::LAST_16        => "last16",
                GameSubTypes::LAST_32        => "last32",
                default                      => "empty"
            };
            $score += $this->calculateKnockout("bonuses.$type");
        } else {
            $score = $this->calculate90Minutes("groupStage");
        }

        return $score;
    }

    protected function setEntity($entity = null)
    {
        $this->game = $entity;
    }

    /**
     * @return BetableInterface
     */
    public function getEntity()
    {
        return $this->game;
    }

    protected function calculate90Minutes(string $type): int
    {
        $game = $this->getGame();
        $resultHome = $game->result_home;
        $resultAway = $game->result_away;

        $score = 0;
        if ($resultHome == $this->getResultHome() && $resultAway == $this->getResultAway()) {
            $score += $this->getScoreConfig("gameBets.{$type}.result");
        }

        if ($this->is1X2Success($resultHome, $resultAway)) {
            $score += $this->getScoreConfig("gameBets.{$type}.winnerSide");
        }

        return $score;
    }

    protected function is1X2Success(int $resultHome, int $resultAway): bool
    {
        return
            ($resultHome == $resultAway && $this->getResultHome() == $this->getResultAway()) // Teko
            || ($resultHome > $resultAway && $this->getResultHome() > $this->getResultAway()) // Winner Home
            || ($resultHome < $resultAway && $this->getResultHome() < $this->getResultAway()); // Winner Away
    }

    protected function calculateKnockout(string $type): int
    {
        $game = $this->getGame();
        $score = $this->calculate90Minutes($type);

        if ($game->isLastLeg() || ($game->getOtherLegGame() && $game->getOtherLegGame()->is_done)){

            if ($this->getKnockoutQualifier() == $game->getKnockoutWinnerSide()) {
                $score += $this->getScoreConfig("gameBets.{$type}.qualifier");
            }
        }

        return $score;
    }
}
