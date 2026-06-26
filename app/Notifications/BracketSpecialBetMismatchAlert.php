<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Internal heads-up (to the site owner) whenever a user's Winner/Runner-Up bracket pick is
 * removed. Mirrors the user-facing BracketSpecialBetRemoved email with just the facts: who,
 * which tournament, and what kind of mismatch.
 */
class BracketSpecialBetMismatchAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $userName,
        public string $userEmail,
        public string $tournamentName,
        public string $mismatchText
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Bracket pick removed — {$this->tournamentName}")
            ->line("User: {$this->userName}")
            ->line("Email: {$this->userEmail}")
            ->line("Tournament: {$this->tournamentName}")
            ->line("Mismatch: {$this->mismatchText}");
    }
}
