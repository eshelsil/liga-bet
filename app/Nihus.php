<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nihus extends Model
{
    use HasFactory;

    protected $fillable = ['target_utl_id', 'sender_utl_id', 'game_id', 'tournament_id', 'text', 'gif'];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(TournamentUser::class, 'sender_utl_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(TournamentUser::class, 'target_utl_id');
    }

}
