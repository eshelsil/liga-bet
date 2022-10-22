<?php

namespace App\SpecialBets;

use App\Bets\BetableInterface;
use App\Competition;
use App\Tournament;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use \Illuminate\Support\Collection;
use App\Game;
use App\Bet;
use App\Team;
use App\Player;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
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

    public function calculateBets(int $competitionId)
    {
        $competition = Competition::query()->with(["tournaments" => [
            "bets" => function ($query) {
                $query->where('type', BetTypes::SpecialBet)
                      ->where("type_id", $this->id);
            }]
        ])->find($competitionId);

        foreach ($competition->tournaments as $tournament) {
            $tournament->setRelation("competition", $competition);
            foreach ($tournament->bets as $bet) {
                try {
                    $betRequest = new BetSpecialBetsRequest($this, $tournament, $bet->getData());
                    $score = $betRequest->calculate();
                    $bet->score = $score;
                    $bet->save();

                    if ($score !== null){
                        echo "USER {$bet->user_id} Score ({$bet->score}) RANKS: {$betRequest->toJson()}<br>";
                    }
                } catch (Exception $exception) {
                    return $exception->getMessage();
                }
            }
        }

        return "OK";
    }

    public function getID()
    {
        return $this->id;
    }

    public static function getByType(string $type): SpecialBet
    {
        return SpecialBet::query()->where("type", $type)->first();
    }

    public function generateRandomBetData()
    {
        $answer = null;
        switch ($this->type) {
            case SpecialBet::TYPE_MVP:
                $answer = Player::all()->random()->name;
                break;
            case SpecialBet::TYPE_MOST_ASSISTS:
                $answer = Player::all()->random()->name;
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                $answer = Team::all()->random()->id;
                break;
            case SpecialBet::TYPE_WINNER:
                $answer = Team::all()->random()->id;
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                $answer = Team::all()->random()->id;
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                $answer = Player::all()->random()->external_id;
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet type \"{$this->type}\"");
        }
        return json_encode(["answer" => $answer]);
    }
}