<?php

namespace App\Bets;

use App\Exceptions\JsonException;
use App\Game;
use App\Tournament;
use Illuminate\Support\Facades\Log;

abstract class AbstractBetRequest
{

    protected Tournament $tournament;

    /**
     * AbstractBetRequest constructor.
     *
     * @param BetableInterface $entity
     * @param array            $data
     */
    public function __construct(BetableInterface $entity, Tournament $tournament, array $data = []) {
        Log::debug("Validating data: {$entity->getID()}\r\nData: ". json_encode($data, JSON_PRETTY_PRINT));
        $this->validateData($entity, $data);
        $this->setEntity($entity);
        $this->tournament = $tournament;
    }

    abstract public function toJson();

    /**
     * @param BetableInterface $entity
     * @param array            $data
     */
    abstract protected function validateData($entity, $data);

    abstract protected function setEntity($entity = null);
    /**
     * @return BetableInterface
     */
    abstract public function getEntity();

    abstract public function calculate();

    protected function getScoreConfig($path) {
        return array_get($this->tournament->config, "scores.{$path}", 0);
    }
}
