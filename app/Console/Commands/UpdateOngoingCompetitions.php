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
            Competition::query()->where("status", Competition::STATUS_ONGOING)
                ->each(fn(Competition $competition) => $uc->handle($competition));

        return SymfonyCommand::SUCCESS;
    }
}
