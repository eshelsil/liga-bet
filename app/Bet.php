<?php

namespace App;

use App\Enums\BetTypes;
use App\Group;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $type
 * @property int $type_id
 * @property int $user_id
 * @property string $data
 * @property int $score
 */
class Bet extends Model
{
    /**
     * Get the phone record associated with the user.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getData($key = null, $default = null)
    {
        return data_get(json_decode($this->data), $key, $default);
    }

    public function getAnswer()
    {
        return $this->getData('answer');
    }

    public function getWinnerSide()
    {
        if ($this->type !== BetTypes::Match){
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

    public function formatMatchBet()
    {
        if ($this->type !== BetTypes::Match){
            return null;
        }
        $winner_side = $this->getWinnerSide();
        $result_home = $this->getData('result-home');
        $result_away = $this->getData('result-away');
        if ($winner_side === "home"){
            return $result_away.":<u>".$result_home."</u>";
        } else if ($winner_side === "away"){
            return "<u>".$result_away."</u>:".$result_home;
        }
        return $result_away.":".$result_home;
    }

    public function getRequest()
    {
        $betEntity = null;
        $abstract = null;
        switch ($this->type) {
            case BetTypes::Match:
                $betEntity = Match::query()->find($this->type_id);
                $abstract = \App\Bets\BetMatch\BetMatch::class;
                break;
            case BetTypes::GroupsRank:
                $betEntity = Group::find($this->type_id);
                $abstract = \App\Bets\BetGroupRank\BetGroupRank::class;
                break;
        }

        return (new $abstract($this, $betEntity));
    }
}
