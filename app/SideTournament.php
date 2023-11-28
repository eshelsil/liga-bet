<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SideTournament extends Model
{

    protected $fillable = [
        'tournament_id', 'name', 'config'
    ];

    protected $casts = [
        "config" => "array"
    ];

    public function tournament(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function getConfig()
    {
        return $this->config ?? [];
    }

    public function competingUtls()
    {
        $tournamentUtls = $this->tournament->competingUtls();
        $config = $this->getConfig();
        if (array_key_exists('competingUtls', $config)){
            $idsToInclude = collect($config['competingUtls']);
            return $tournamentUtls->filter(fn(TournamentUser $utl) => $idsToInclude->search($utl->id));
        }
        return $tournamentUtls;
    }

    public function isUserCompeting(User $user)
    {
        $utl = $user->getTournamentUser($this->tournament_id);
        return $this->competingUtls()->pluck('id')->contains($utl->id);
    }
}
