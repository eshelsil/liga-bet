<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TournamentUser extends Model
{
    protected $table = 'user_tournament_links';

    public function getBets(){
        $bets = Bet::query()
            ->where("user_tournament_id", $this->id)
            ->get();
        return $bets;
    }
}
