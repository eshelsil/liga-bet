<?php

namespace App\Notifications;

use App\SpecialBets\SpecialBet;
use App\Team;
use App\Tournament;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Emailed to a user when their Winner/Runner-Up bracket pick is removed server-side, either because the
 * team didn't qualify into the knockout stage or because the Winner & Runner-Up ended up on the same side
 * of the bracket (the Runner-Up is dropped). No forced re-pick flow — informational only.
 */
class BracketSpecialBetRemoved extends Notification implements ShouldQueue
{
    use Queueable;

    public const REASON_DID_NOT_QUALIFY = 'did_not_qualify';
    public const REASON_SAME_SIDE = 'same_side';

    public function __construct(
        public Tournament $tournament,
        public string $specialBetType,
        public ?Team $team,
        public string $reason
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $teamName = $this->team?->name ?? 'the team you picked';
        $pickName = $this->specialBetType === SpecialBet::TYPE_RUNNER_UP ? 'runner-up' : 'winner';

        $reasonText = $this->reason === self::REASON_SAME_SIDE
            ? "The winner and runner-up you picked are on the same side of the bracket, so your runner-up pick ({$teamName}) was removed."
            : "{$teamName} has been eliminated and did not qualify for the knockout stage, so your {$pickName} pick was removed.";

        return (new MailMessage)
            ->subject("Special bet removed — {$this->tournament->name}")
            ->line($reasonText)
            ->line("You can make a new pick as long as the tournament hasn't started.")
            ->action('Make a new pick', 'https://www.liga-bet.live/open-matches');
    }
}
