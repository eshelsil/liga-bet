<?php

namespace App\Console\Commands;

use App\Actions\UpdateCompetition;
use App\Competition;
use App\TournamentUser;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class UpdateOngoingCompetitions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'liga-bet:update-running-competitions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(UpdateCompetition $uc)
    {
        // Auto-start (all tournament types): once the first game has started, flip the
        // competition INITIAL -> ONGOING. Guard against competitions with no games yet
        // (min start_time would be null and read as "started").
        Competition::query()->where("status", Competition::STATUS_INITIAL)
            ->each(function(Competition $competition) {
                $startTime = $competition->getTournamentStartTime();
                if (!is_null($startTime) && time() > $startTime) {
                    $competition->start();
                }
            });
        Competition::query()->where("status", Competition::STATUS_ONGOING)
            ->each(function(Competition $competition) {
                $competition->startPendingTournaments();
            });

        
        Competition::query()->where("status", Competition::STATUS_ONGOING)
            ->each(fn(Competition $competition) => $uc->handle($competition));

        return SymfonyCommand::SUCCESS;
    }
}
