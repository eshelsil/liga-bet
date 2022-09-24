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

    protected $cacheAnswer = null;

    /**
     * @return BelongsTo
     */
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function getOffensiveTeams(){
        $matches = $this->tournament->competition->getGroupStageGamesIfStageDone();
        if (!$matches) {
            return collect();
        }

        $gsByTeamId = [];
        foreach ($matches as $match) {
            foreach($match->getGoalsData() as $teamId => $gs){
                if (!array_key_exists($teamId, $gsByTeamId)){
                    $gsByTeamId[$teamId] = 0;
                }
                $gsByTeamId[$teamId] += $gs;
            }
        }

        $maxGoals = max(array_values($gsByTeamId));

        return collect($gsByTeamId)
            ->filter(fn($goalsScored, $teamId) => $goalsScored == $maxGoals)
            ->keys();
    }

    public function calculateOffensiveTeam($team_id)
    {
        $score = 5;

        if ($this->getAnswer()->contains($team_id)){
            return $score;
        }

        return 0;
    }

    public function calcMVP($player_name){
        $score = 10;

        $mvp = config('bets.mvp');
        if (!$mvp){
            return null;
        }
        return $player_name == $mvp ? $score : 0;
    }

    public function getTopAssists(){
        $topAssistsPlayers = config('bets.topAssists');
        if ($topAssistsPlayers && !is_array($topAssistsPlayers)){
            $topAssistsPlayers = array($topAssistsPlayers);
        }
        return $topAssistsPlayers;
    }

    public function calcTopAssists($player_name){
        $score = 10;
        
        $topAssitsPlayers = $this->getTopAssists();
        if (!$topAssitsPlayers){
            return null;
        }
        return in_array($player_name, $topAssitsPlayers) ? $score : 0;
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

    public function calcRoadToFinal($teamId)
    {
        $scoreForStage = 5;

        $score = 0;

        $koGames = $this->tournament->competition
            ->games->filter(function(Game $game) use($teamId) {
                return in_array($teamId, [$game->team_home_id, $game->team_away_id]) &&
                       !is_null($game->result_home) && !is_null($game->result_home) && $game->type == 'knockout';
            });

        /** @var Game $game */
        foreach ($koGames as $game) {
            if ($game->sub_type == 'FINAL') {
                continue;
            }
            if ($game->getKnockoutWinner() == $teamId) {
                $score += $scoreForStage;
            }
        }

        return $score;
    }

    public function calcChampions($teamId){
        $scoreForWinningFinal = 15;

        $score = $this->calcRoadToFinal($teamId);
        $final = $this->tournament->competition->getFinalGame();
        if (!$final || !$final->is_done) {
            return null;
        }

        if ($final->getKnockoutWinner() == $teamId) {
            $score += $scoreForWinningFinal;
        }
        return $score;
    }

    public function getTopScorers(){
        $players = $this->tournament->competition->players;
        $maxGoals = $players->max("goals") ?? -1; // -1 for Empty, means not ready. do not keep null to not try to recalculate?

        return $players->where("goals", $maxGoals)->pluck("id");
    }

    public function calcTopScorer($playerId){
        $score_for_goal = 2;
        $top_scorer_bonus = 4;

        $score = 0;

        $player = $this->tournament->competition->players->find($playerId);

        if ($this->getAnswer()->contains($playerId)) {
            $score += $top_scorer_bonus;
        }

        $score += ($score_for_goal * $player->goals);

        return $score;
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
                    $betRequest = new BetSpecialBetsRequest($this, $bet->getData());
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

    public function calculateScore($bet_answer)
    {
        switch ($this->type) {
            case SpecialBet::TYPE_MVP:
                return $this->calcMVP($bet_answer);
                break;
            case SpecialBet::TYPE_MOST_ASSISTS:
                return $this->calcTopAssists($bet_answer);
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                return $this->calculateOffensiveTeam($bet_answer);
                break;
            case SpecialBet::TYPE_WINNER:
                return $this->calcChampions($bet_answer);
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                return $this->calcRoadToFinal($bet_answer);
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                return $this->calcTopScorer($bet_answer);
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet name \"{$this->name}\"");
        }
    }

    public function getAnswer()
    {
        if ($this->cacheAnswer) {
            return $this->cacheAnswer;
        }

        switch ($this->type) {
            case SpecialBet::TYPE_MVP:
                return config('bets.mvp');
                break;
            case SpecialBet::TYPE_MOST_ASSISTS:
                return $this->getTopAssists();
                break;
            case SpecialBet::TYPE_OFFENSIVE_TEAM:
                $this->cacheAnswer = $this->getOffensiveTeams();
                break;
            case SpecialBet::TYPE_WINNER:
                return $this->getChampions();
                break;
            case SpecialBet::TYPE_RUNNER_UP:
                return $this->getRunnerUp();
                break;
            case SpecialBet::TYPE_TOP_SCORER:
                $this->cacheAnswer = $this->getTopScorers();
                break;
            default:
                throw new InvalidArgumentException("Invalid SpecialBet type \"{$this->type}\"");
        }

        return $this->cacheAnswer;
    }

    public static function hasAllCustomAnswers(){
        return !is_null(config('bets.topAssists')) && !is_null(config('bets.mvp'));
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