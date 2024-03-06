<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NihusGrant extends Model
{
    use HasFactory;

    protected $fillable = ['user_tournament_id', 'notified', 'amount', 'grant_reason'];

    public function utl(): BelongsTo
    {
        return $this->belongsTo(TournamentUser::class);
    }

}
