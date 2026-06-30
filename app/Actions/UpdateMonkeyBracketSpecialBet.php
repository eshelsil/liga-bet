<?php

namespace App\Actions;

use App\Bet;
use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use App\TournamentUser;
use InvalidArgumentException;

/**
 * Manually (re)set a monkey's bracket Winner OR Runner-Up pick to a random team from a chosen bracket
 * side. Run from tinker — there is no API endpoint. Examples:
 *
 *   $utl = \App\TournamentUser::find($utlId);
 *   app(\App\Actions\UpdateMonkeyBracketSpecialBet::class)->handle($utl, 'winner', 'left');
 *   app(\App\Actions\UpdateMonkeyBracketSpecialBet::class)->handle($utl, 'runnerUp', 'right');
 *   app(\App\Actions\UpdateMonkeyBracketSpecialBet::class)->handle($utl, 'winner', 'any');
 *
 * Candidates are all teams that STARTED the bracket's first round on the requested side — eliminated
 * teams included (this is a manual betting fix). Re-run update-leaderboards afterwards to rescore.
 */
class UpdateMonkeyBracketSpecialBet
{
    /**
     * @param TournamentUser $utl   the (monkey's) tournament-user whose pick to set
     * @param string         $role  'winner' | 'runnerUp'
     * @param string         $side  'left' | 'right' | 'any'
     * @return int|null             the chosen team id, or null if no candidates on that side
     */
    public function handle(TournamentUser $utl, string $role, string $side = 'any'): ?int
    {
        $type = match ($role) {
            'winner'                => SpecialBet::TYPE_WINNER,
            'runnerUp', 'runner_up' => SpecialBet::TYPE_RUNNER_UP,
            default => throw new InvalidArgumentException("role must be 'winner' or 'runnerUp', got \"{$role}\""),
        };
        if (!in_array($side, ['left', 'right', 'any'], true)) {
            throw new InvalidArgumentException("side must be 'left', 'right' or 'any', got \"{$side}\"");
        }

        $tournament = $utl->tournament;
        if (!$tournament->isKnockoutBracket()) {
            throw new InvalidArgumentException("Tournament {$tournament->id} is not a knockout-bracket tournament");
        }

        $pool = $tournament->competition->getFirstRoundBracketTeamIds($side === 'any' ? null : $side);
        if ($pool->isEmpty()) {
            return null;
        }
        $teamId = (int) $pool->random();

        $specialBet = SpecialBet::getByType($tournament->id, $type);

        $bet = Bet::query()
            ->where('user_tournament_id', $utl->id)
            ->where('type', BetTypes::SpecialBet)
            ->where('type_id', $specialBet->getID())
            ->first() ?? new Bet();
        $bet->user_tournament_id = $utl->id;
        $bet->tournament_id      = $tournament->id;
        $bet->type               = BetTypes::SpecialBet;
        $bet->type_id            = $specialBet->getID();
        $bet->data               = json_encode(["answer" => $teamId]);
        $bet->save();

        return $teamId;
    }
}
