<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SideTournament extends Model
{

    protected $fillable = [
        'tournament_id', 'name',
    ];

    public function tournament(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

}
