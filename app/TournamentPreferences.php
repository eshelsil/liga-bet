<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TournamentPreferences extends Model
{

    protected $fillable = [
        'tournament_id', 'auto_approve_users', 'use_default_config_answered', 'enable_auto_bet',
    ];

    protected $casts = [
        'auto_approve_users' => 'boolean',
        'use_default_config_answered' => 'boolean',
        'enable_auto_bet' => 'boolean',
    ];

    public function isAutoConfirmUtlsOn(){
        return !!$this->auto_approve_users;
    }

    public function isAutoBetOn(){
        return !!$this->enable_auto_bet;
    }

}
