<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TournamentPreferences extends Model
{

    protected $fillable = [
        'tournament_id', 'auto_approve_users', 'use_default_config_answered',
    ];

    public function isAutoConfirmUtlsOn(){
        return !!$this->auto_approve_users;
    }

}
