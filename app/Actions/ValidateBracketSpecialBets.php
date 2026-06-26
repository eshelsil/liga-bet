<?php

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\Enums\BetTypes;
use App\Notifications\BracketSpecialBetMismatchAlert;
use App\Notifications\BracketSpecialBetRemoved;
use App\SpecialBets\SpecialBet;
use App\Team;
use App\Tournament;
use App\TournamentUser;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

/**
 * Incremental validation of bracket Winner/Runner-Up picks. Run from UpdateCompetition whenever
 * bracket games progress. Idempotent — safe to run every cycle.
 *
 * "Did not qualify" is determined by Competition::getNonQualifiedTeamIds(), which is false-positive-free:
 *  - while the bracket is still being seeded, it relies only on the feed's is_eliminated flag (a
 *    best-3rd-place team that can still advance is NOT flagged);
 *  - once the first knockout round is fully seeded, it also treats any group team absent from a bracket
 *    slot as out. Once that fully-seeded reconciliation has run for a tournament, we stamp
 *    `config.bracketSpecialBetsValidated` and skip it thereafter — nothing more can change.
 *
 * Two removal rules:
 *  - Didn't qualify: the picked team is in getNonQualifiedTeamIds() → remove its Winner/Runner-Up bet(s).
 *  - Same side: once both of a user's picks have a resolved side and they share it → remove the Runner-Up.
 *
 * On removal: release that team's auto-locked qualifier bets (unless still covered by the user's other,
 * kept pick) and email the user via BracketSpecialBetRemoved.
 */
class ValidateBracketSpecialBets
{
    public function handle(Competition $competition): void
    {
        if (!$competition->supportsBracket()) {
            return;
        }

        $competition->loadMissing(['groups', 'tournaments.specialBets']);

        $nonQualified = $competition->getNonQualifiedTeamIds();
        $seeded = $competition->isGroupStageBracketSeeded();

        foreach ($competition->tournaments as $tournament) {
            if (!$tournament->isKnockoutBracket()) {
                continue;
            }
            if (data_get($tournament->config, 'bracketSpecialBetsValidated') === true) {
                continue; // final slot-based reconciliation already done — picks are settled
            }

            $this->validateTournament($tournament, $competition, $nonQualified);

            if ($seeded) {
                $this->markValidated($tournament);
            }
        }
    }

    private function markValidated(Tournament $tournament): void
    {
        $config = $tournament->config ?? [];
        $config['bracketSpecialBetsValidated'] = true;
        $tournament->config = $config;
        $tournament->save();
    }

    private function validateTournament(Tournament $tournament, Competition $competition, Collection $nonQualified): void
    {
        $winnerSb = $tournament->specialBets->firstWhere('type', SpecialBet::TYPE_WINNER);
        $runnerSb = $tournament->specialBets->firstWhere('type', SpecialBet::TYPE_RUNNER_UP);
        $sbIds = collect([$winnerSb?->id, $runnerSb?->id])->filter();
        if ($sbIds->isEmpty()) {
            return;
        }

        $betsByUtl = Bet::query()
            ->where('tournament_id', $tournament->id)
            ->where('type', BetTypes::SpecialBet)
            ->whereIn('type_id', $sbIds)
            ->with('utl')
            ->get()
            ->groupBy('user_tournament_id');

        foreach ($betsByUtl as $userBets) {
            $winnerBet = $winnerSb ? $userBets->firstWhere('type_id', $winnerSb->id) : null;
            $runnerBet = $runnerSb ? $userBets->firstWhere('type_id', $runnerSb->id) : null;

            // Rule A — didn't qualify.
            foreach ([SpecialBet::TYPE_WINNER => $winnerBet, SpecialBet::TYPE_RUNNER_UP => $runnerBet] as $type => $bet) {
                if (!$bet) {
                    continue;
                }
                $teamId = (int) $bet->getAnswer();
                if ($nonQualified->contains($teamId)) {
                    $this->removeBet($bet, $tournament, $type, BracketSpecialBetRemoved::REASON_DID_NOT_QUALIFY);
                    if ($type === SpecialBet::TYPE_WINNER) {
                        $winnerBet = null;
                    } else {
                        $runnerBet = null;
                    }
                }
            }

            // Rule B — Winner & Runner-Up on the same side: drop the Runner-Up.
            if ($winnerBet && $runnerBet) {
                $winnerSide = $competition->getBracketSide((int) $winnerBet->getAnswer());
                $runnerSide = $competition->getBracketSide((int) $runnerBet->getAnswer());
                if ($winnerSide && $runnerSide && $winnerSide === $runnerSide) {
                    $this->removeBet($runnerBet, $tournament, SpecialBet::TYPE_RUNNER_UP, BracketSpecialBetRemoved::REASON_SAME_SIDE);
                }
            }
        }
    }

    private function removeBet(Bet $bet, Tournament $tournament, string $specialBetType, string $reason): void
    {
        $utl = $bet->utl;
        $teamId = (int) $bet->getAnswer();
        if (!$utl) {
            $bet->delete();
            return;
        }

        DB::transaction(function () use ($bet, $utl, $teamId) {
            $this->releaseLockedQualifiers($utl, $teamId, $bet->id);
            $bet->delete();
        });

        Log::info("[ValidateBracketSpecialBets] Removed {$specialBetType} bet {$bet->id} (utl {$utl->id}, team {$teamId}) — {$reason}");

        $team = Team::find($teamId);
        $user = $utl->user;

        try {
            $user?->notify(new BracketSpecialBetRemoved($tournament, $specialBetType, $team, $reason));
        } catch (\Throwable $e) {
            Log::error("[ValidateBracketSpecialBets] Notify failed for utl {$utl->id}: {$e->getMessage()}");
        }

        // Internal heads-up to the site owner.
        try {
            $adminAlertEmail = env('ADMIN_ALERT_EMAIL');
            if ($adminAlertEmail) {
                $mismatchText = $reason === BracketSpecialBetRemoved::REASON_SAME_SIDE
                    ? 'had bracket-side mismatch'
                    : 'Team ' . ($team?->name ?? '[unknown]') . ' did not qualify';
                Notification::route('mail', $adminAlertEmail)->notify(
                    new BracketSpecialBetMismatchAlert(
                        $user?->name ?? 'Unknown',
                        $user?->email ?? 'unknown',
                        $tournament->name,
                        $mismatchText
                    )
                );
            }
        } catch (\Throwable $e) {
            Log::error("[ValidateBracketSpecialBets] Admin alert failed for utl {$utl->id}: {$e->getMessage()}");
        }
    }

    /**
     * Delete the user's auto-locked qualifier Game bets for the removed team's knockout games, unless the
     * game is still locked by the user's other (kept) Winner/Runner-Up pick.
     */
    private function releaseLockedQualifiers(TournamentUser $utl, int $removedTeamId, int $removedBetId): void
    {
        $stillLockedTeamIds = $this->remainingLockedTeamIds($utl, $removedBetId);
        if ($stillLockedTeamIds->contains($removedTeamId)) {
            return; // team still covered by the user's other pick
        }

        $competition = $utl->tournament->competition;
        foreach ($competition->getKnockoutGames($removedTeamId) as $game) {
            if ($stillLockedTeamIds->contains($game->team_home_id) || $stillLockedTeamIds->contains($game->team_away_id)) {
                continue; // game still locked by the kept pick
            }
            Bet::query()
                ->where('tournament_id', $utl->tournament_id)
                ->where('user_tournament_id', $utl->id)
                ->where('type', BetTypes::Game)
                ->where('type_id', $game->id)
                ->delete();
        }
    }

    private function remainingLockedTeamIds(TournamentUser $utl, int $excludeBetId): Collection
    {
        $winnerSb = SpecialBet::getByType($utl->tournament_id, SpecialBet::TYPE_WINNER);
        $runnerSb = SpecialBet::getByType($utl->tournament_id, SpecialBet::TYPE_RUNNER_UP);
        $sbIds = collect([$winnerSb?->id, $runnerSb?->id])->filter();
        if ($sbIds->isEmpty()) {
            return collect();
        }

        return Bet::query()
            ->where('user_tournament_id', $utl->id)
            ->where('type', BetTypes::SpecialBet)
            ->whereIn('type_id', $sbIds)
            ->where('id', '!=', $excludeBetId)
            ->get()
            ->map(fn (Bet $b) => (int) $b->getAnswer())
            ->filter()
            ->values();
    }
}
