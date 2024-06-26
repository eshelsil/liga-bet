<?php

namespace App\SpecialBets;

use App\Bets\BetableInterface;
use App\Competition;
use App\Tournament;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Team;
use App\Player;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

/**
 * App\SpecialBets\SpecialBet
 *
 * @property int $id
 * @property int $tournament_id
 * @property string $type
 * @property string $title
 * @property string|null $answer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Tournament|null $tournament
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet query()
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SpecialBet whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class SpecialBet extends Model implements BetableInterface
{

    const TYPE_WINNER = "winner";
    const TYPE_RUNNER_UP   = "runner_up";
    const TYPE_TOP_SCORER = "top_scorer";
    const TYPE_MOST_ASSISTS = "most_assists";
    const TYPE_MVP = "mvp";
    const TYPE_OFFENSIVE_TEAM = "offensive_team";
    const TYPE_DEFENSIVE_TEAM = "defensive_team";

    static $typeToFlagName = [
        "winner" => "winner",
        "runner_up" => "runnerUp",
        "top_scorer" => "topScorer",
        "most_assists" => "topAssists",
        "mvp" => "mvp",
        "offensive_team" => "offensiveTeam",
        "defensive_team" => "defensiveTeam",
    ];

    protected static $unguarded = true;

    /**
     * @return BelongsTo
     */
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function getChampions(){
        $final = $this->tournament->competition->getFinalGame();
        if (!$final || !$final->is_done){
            return null;
        }
        return $final->getKnockoutWinner();
    }

    public function getRunnerUp(){
        $final = $this->tournament->competition->getFinalGame();
        if (!$final || !$final->is_done){
            return null;
        }

        return $final->getKnockoutLoser();
    }

    public function calculateBets()
    {
        if (config("test.onlyTournamentId") && config("test.onlyTournamentId") != $this->tournament->id) {
            return;
        }

        Log::debug("[SpecialBet][calculateBets] Start [{$this->type}] for tournament {$this->tournament->id}");

        $this->tournament->load(["bets" => function ($query) {
            $query->where('type', BetTypes::SpecialBet)
                  ->where("type_id", $this->id);
        }]);

        foreach ($this->tournament->bets->load("utl") as $bet) {
            Log::debug("[SpecialBet][calculateBets] Start with bet {$bet->id}");

            try {
                $betRequest = new BetSpecialBetsRequest($this, $this->tournament, $bet->getData() + ["utl" => $bet->utl]);
                $score = $betRequest->calculate();
                $bet->score = $score;
                $bet->save();

                if ($score !== null){
                    Log::debug("[SpecialBet][calculateBets] USER {$bet->user_tournament_id} Score ({$bet->score}) Data: {$betRequest->toJson()})");
                }
            } catch (Exception $e) {
                Log::debug("[SpecialBet][calculateBets] Error! {$e->getMessage()} - {$e->getTraceAsString()}");
            }
        }

        return "OK";
    }

    public function isPlayerQuestion()
    {
        return in_array($this->type, [SpecialBet::TYPE_MOST_ASSISTS, SpecialBet::TYPE_MVP, SpecialBet::TYPE_TOP_SCORER]);
    }

    public function getID()
    {
        return $this->id;
    }

    public function getFlagName()
    {
        return static::$typeToFlagName[$this->type];
    }

    public function isOn(){
        $config = $this->tournament->config;
        $flagName = $this->getFlagName();
        return data_get($config, "scores.specialQuestionFlags.".$flagName, false);
    }

    public static function getByType(int $tournamentId, string $type): SpecialBet
    {
        return SpecialBet::query()
                         ->where("tournament_id", $tournamentId)
                         ->where("type", $type)
                         ->first();
    }

    private function getRandomPlayerId()
    {
        return $this->tournament->competition->players->random()->id;
    }

    private function getRandomTeamId()
    {
        return $this->tournament->competition->teams->random()->id;
    }

    public function generateRandomBetData()
    {
        $answer = null;
        switch ($this->type) {
            case SpecialBet::TYPE_MVP:
                $answer = $this->getRandomPlayerId();
                break;
            case SpecialBet::TYPE_MOST_ASSISTS:
                $answer = $this->getRandomPlayerId();
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                $answer = $this->getRandomTeamId();
                break;
            case SpecialBet::TYPE_WINNER:
                $answer = $this->getRandomTeamId();
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                $answer = $this->getRandomTeamId();
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                $answer = $this->getRandomPlayerId();
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet type \"{$this->type}\"");
        }
        return json_encode(["answer" => $answer]);
    }
}