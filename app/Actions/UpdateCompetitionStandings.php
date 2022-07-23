<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Competition;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Game;
use App\Group;
use App\Scorer;
use App\Team;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class UpdateCompetitionStandings
{
    private CalculateSpecialBets $calculateSpecialBets;

    public function __construct(CalculateSpecialBets $calculateSpecialBets) {
        $this->calculateSpecialBets = $calculateSpecialBets;
    }

    public function handle(Competition $competition)
    {
        $finalStandings    = $competition->getCrawler()->fetchGroupStandings();
        $groupsNotCompleted = $competition->groups->filter(fn (Group $g) => !$g->isComplete())->keyBy("external_id");
        $teamExtIdToId  = $competition->teams->pluck("external_id", "id");

        /**
         * @var int $groupId
         * @var \Illuminate\Support\Collection $standings
         */
        foreach ($finalStandings as $groupId => $standings) {
            /** @var ?Group $group */
            if ( ! $group = $groupsNotCompleted->get($groupId)) {
                continue;
            }

            $standings = $standings->map(function ($row) use ($teamExtIdToId) {
                $row['team_id'] = $teamExtIdToId[$row['team_ext_id']];
                return $row;
            });

            $group->standings = $standings->toJson();
            $group->save();

            Log::debug("updated final standings of group \"{$group->name}\"");

            $group->calculateBets();
        }
    }
}