<?php

namespace App\Actions;

use App\Bet;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Enums\BetTypes;
use App\Game;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use Illuminate\Support\Facades\Log;

/**
 * Propagate + lock a user's Winner/Runner-Up pick into the per-game qualifier bets.
 *
 * When a Winner/Runner-Up special bet is saved, the chosen team's qualifier is auto-selected (= that team
 * advances) and locked for every known knockout game it plays. Lockedness is derived dynamically elsewhere
 * (team ∈ user's Winner/Runner-Up answers) — there is no DB column; here we only upsert the bet rows.
 */
class ApplyBracketSpecialBetQualifiers
{
    /**
     * After a user saves a (valid) Winner/Runner-Up pick for $teamId: lock the qualifier of every currently
     * known knockout game that team plays.
     */
    public function handle(TournamentUser $utl, int $teamId): void
    {
        $competition = $utl->tournament->competition;
        $games = $competition->getKnockoutGames($teamId)
            ->filter(fn (Game $g) => $g->team_home_id && $g->team_away_id);

        foreach ($games as $game) {
            $this->upsertLockedQualifier($utl, $game, $teamId);
        }
    }

    /**
     * When the crawler creates a new knockout game, auto-create the locked qualifier bet for every bracket
     * user whose Winner/Runner-Up is one of the two participating teams.
     */
    public function handleForNewGame(Game $game): void
    {
        if (!$game->isKnockout() || !$game->team_home_id || !$game->team_away_id) {
            return;
        }
        $teamIds = [$game->team_home_id, $game->team_away_id];
        $competition = $game->competition;
        $competition->loadMissing('tournaments.specialBets');

        foreach ($competition->tournaments as $tournament) {
            if (!$tournament->isKnockoutBracket()) {
                continue;
            }
            $specialBetIds = $tournament->specialBets
                ->whereIn('type', [SpecialBet::TYPE_WINNER, SpecialBet::TYPE_RUNNER_UP])
                ->pluck('id');
            if ($specialBetIds->isEmpty()) {
                continue;
            }

            $bets = Bet::query()
                ->where('tournament_id', $tournament->id)
                ->where('type', BetTypes::SpecialBet)
                ->whereIn('type_id', $specialBetIds)
                ->with('utl')
                ->get();

            foreach ($bets as $bet) {
                $teamId = (int) $bet->getAnswer();
                if ($bet->utl && in_array($teamId, $teamIds, true)) {
                    $this->upsertLockedQualifier($bet->utl, $game, $teamId);
                }
            }
        }
    }

    private function upsertLockedQualifier(TournamentUser $utl, Game $game, int $teamId): void
    {
        $side = $game->getTeamSide($teamId);
        if (!$side) {
            return;
        }
        try {
            $request = new BetMatchRequest($game, $utl->tournament, ["winner_side" => $side]);
            BetMatch::save($utl, $request);
        } catch (\Throwable $e) {
            Log::error("[ApplyBracketSpecialBetQualifiers] Failed for utl {$utl->id} game {$game->id}: {$e->getMessage()}");
        }
    }
}
