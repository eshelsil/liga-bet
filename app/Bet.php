<?php

namespace App;

use App\Enums\BetTypes;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Bet
 *
 * @property int $id
 * @property int $type
 * @property int $type_id
 * @property string $data
 * @property int|null $score
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $tournament_id
 * @property int $user_tournament_id
 * @property-read \App\Tournament|null $tournament
 * @property-read \App\TournamentUser|null $utl
 * @method static \Illuminate\Database\Eloquent\Builder|Bet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Bet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Bet query()
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bet whereUserTournamentId($value)
 * @mixin \Eloquent
 */
class Bet extends Model
{

    protected static $unguarded = true;

    public function utl()
    {
        return $this->belongsTo(TournamentUser::class, "user_tournament_id");
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function getData($key = null, $default = null)
    {
        return data_get(json_decode($this->data, true), $key, $default);
    }

    public function getAnswer()
    {
        return $this->getData('answer');
    }

    public function isGameBet()
    {
        return $this->type === BetTypes::Game;
    }
    public function isGroupRankBet()
    {
        return $this->type === BetTypes::GroupsRank;
    }
    public function isQuestionBet()
    {
        return $this->type === BetTypes::SpecialBet;
    }

    public function isMatchingSideTournament(?int $sideTournamentId)
    {
        if (!$this->isGameBet()){
            return $sideTournamentId == null;
        }
        $gameSideTournamnets = $this->tournament->getSideTournamentGames()->get($this->type_id);
        if (!$gameSideTournamnets){
            return $sideTournamentId == null;
        }
        return collect($gameSideTournamnets)->contains($sideTournamentId);
    }

    public function export_data()
    {
        $bet = $this->getAttributes();
        unset($bet['data']);
        if ($this->isGameBet()){
            $bet['result_home'] = $this->getData('result-home');
            $bet['result_away'] = $this->getData('result-away');
            $bet['winner_side'] = $this->getData('ko_winner_side');
        } elseif ($this->isGroupRankBet()) {
            $bet['standings'] = $this->getData();
        } elseif ($this->isQuestionBet()) {
            $bet['answer'] = $this->getData('answer');
        }
        return $bet;
    }

    public function getWinnerSide()
    {
        if ($this->type !== BetTypes::Game){
            return null;
        }
        $result_home = (int)$this->getData('result-home');
        $result_away = (int)$this->getData('result-away');
        if ($result_home > $result_away){
            return "home";
        } else if ($result_home < $result_away){
            return "away";
        }
        return $this->getData('ko_winner_side');
    }

    public function formatMatchBet($options = [])
    {
        $winner_class = $options['winner_class'] ?? '';
        $only_if_tied = $options['only_if_tied'] ?? false;
        
        if ($this->type !== BetTypes::Game){
            return null;
        }
        $winner_side = $this->getWinnerSide();
        $result_home = $this->getData('result-home');
        $result_away = $this->getData('result-away');
        if ($only_if_tied && $result_home !== $result_away){
            $winner_class = '';
        }
        if ($winner_side === "home"){
            return $result_away.":<span class='{$winner_class}'>".$result_home."</span>";
        } else if ($winner_side === "away"){
            return "<span class='{$winner_class}'>".$result_away."</span>:".$result_home;
        }
        return $result_away.":".$result_home;
    }

    public function getRequest()
    {
        $betEntity = null;
        $abstract = null;
        switch ($this->type) {
            case BetTypes::Game:
                $betEntity = Game::query()->find($this->type_id);
                $abstract = \App\Bets\BetMatch\BetMatch::class;
                break;
            case BetTypes::GroupsRank:
                $betEntity = Group::find($this->type_id);
                $abstract = \App\Bets\BetGroupsRank\BetGroupRank::class;
                break;
        }

        return (new $abstract($this, $betEntity));
    }
}
