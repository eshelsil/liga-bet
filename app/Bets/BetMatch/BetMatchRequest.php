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
    protected int|null $resultHome;
    protected int|null $resultAway;

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


    protected function validateData($game, $data)
    {
        if ($this->tournament->isKnockoutBracket()){
            return $this->validateDataBracket($game, $data);
        }
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

    /**
     * Bracket bets always carry the qualifier ("winner_side"). When the tournament has a
     * perfect-result tier configured, an optional exact-score prediction may accompany it: if
     * either result field is present, both must be numeric. A qualifier-only bet (no score) is
     * still valid.
     */
    protected function validateDataBracket(Game $game, $data)
    {
        if (!$game->isKnockout()) {
            Log::debug("[BetMatchRequest][validateDataBracket] Game ". $game->id ." is not knockout, skipping validation");
            return;
        }
        $koWinnerSide = data_get($data, "winner_side");
        if (!in_array($koWinnerSide, ["home", "away"], true)) {
            $paramString = is_null($koWinnerSide) ? "null" : $koWinnerSide;
            throw new \InvalidArgumentException("Bracket qualifier bet's \"winner_side\" must be one of [\"home\", \"away\"]. <br>Got: {$paramString}");
        }
        if (!$this->tournament->isResultBetOn()) {
            return; // no perfect-result tier configured, so no further validation needed
        }
        $resultHome = data_get($data, "result-home");
        $resultAway = data_get($data, "result-away");
        if ((!is_null($resultHome) || !is_null($resultAway)) && (!is_numeric($resultHome) || !is_numeric($resultAway))) {
            throw new \InvalidArgumentException("Bracket result prediction requires numeric result-home and result-away.");
        }
    }

    protected function validateDataTwoLeggedTie(Game $game, $data)
    {
        $isQualifierBetOn = !!data_get($this->tournament->config, "scores.gameBets.knockout.qualifier");
        $resultHome = data_get($data, "result-home");
        $resultAway = data_get($data, "result-away");
        $koWinnerSide = data_get($data, "winner_side");
        if ($game->isLastLeg() && in_array($koWinnerSide, ["home", "away"]) && is_null($resultHome) && is_null($resultAway)){
            // Allow bet with qualifier and empty-result for second-leg, as it is generated automatically when betting on first-leg game - update validation should happen on API level
            return;
        }
        if ($game->isLastLeg() && is_null($koWinnerSide) && is_numeric($resultHome) && is_numeric($resultAway)){
            // Allow bet with score and no qualifier for second-leg, as it should get qualifier automatically when betting on first-leg game - update validation should happen on API level
            return;
        }
        if ($game->isKnockout() && $isQualifierBetOn && !in_array($koWinnerSide, ["home", "away"])){
            $paramString = is_null($koWinnerSide) ? "null" : $koWinnerSide;
            throw new \InvalidArgumentException("Knockout Bet's \"winner_side\" parameter must be one of [\"away\", \"home\"] if score is tied. <br>Got: {$paramString}");
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
        if ($this->tournament->isKnockoutBracket()) {
            return $this->calculateBracket();
        }
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
        if (is_null($this->getResultHome()) || is_null($this->getResultAway())) {
            return 0;
        }
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

    /**
     * Bracket scoring, per round (by sub_type):
     *  - qualifier: bracket.qualifier[sub_type] when the picked side matches the actual qualifier
     *    (THIRD_PLACE included).
     *  - perfect result: bracket.result[sub_type] when an exact score was predicted and matches the
     *    game result — only when the tournament has the result tier on (isResultBetOn).
     * The two are additive.
     */
    protected function calculateBracket(): int
    {
        $game = $this->getGame();
        if (!$game->isKnockout() || !$game->is_done) {
            return 0;
        }

        $score = 0;

        $actual = $game->getKnockoutWinnerSide();
        if ($actual !== null && $this->getKnockoutQualifier() === $actual) {
            $score += (int) $this->getScoreConfig("bracket.qualifier.{$game->sub_type}");
        }

        if (
            $this->tournament->isResultBetOn()
            && !is_null($this->getResultHome())
            && !is_null($this->getResultAway())
            && (int) $game->result_home === (int) $this->getResultHome()
            && (int) $game->result_away === (int) $this->getResultAway()
        ) {
            $score += (int) $this->getScoreConfig("bracket.result.{$game->sub_type}");
        }

        return $score;
    }

    protected function calculateKnockout(string $type): int
    {
        $game = $this->getGame();
        $score = $this->calculate90Minutes($type);

        if ($game->isLastLeg()){
            if ($this->getKnockoutQualifier() == $game->getKnockoutWinnerSide()) {
                $score += $this->getScoreConfig("gameBets.{$type}.qualifier");
            }
        }

        return $score;
    }
}
