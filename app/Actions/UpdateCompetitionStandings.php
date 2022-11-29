<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Group;
use Illuminate\Support\Facades\Log;

class UpdateCompetitionStandings
{
    public function __construct(
        private readonly UpdateLeaderboards $updateLeaderboards,
    ) { }

    public function fake(?\Illuminate\Support\Collection $standings = null)
    {
        $this->fakeStandings = $standings;
    }

    public function handle(Competition $competition)
    {
        $finalStandings    = $this->fakeStandings ?? $competition->getCrawler()->fetchGroupStandings();
        $groupsNotCompleted = $competition->groups->filter(fn (Group $g) => !$g->isComplete())->keyBy("external_id");
        $teamExtIdToId  = $competition->teams->pluck("id", "external_id");
        /**
         * @var int $groupId
         * @var \Illuminate\Support\Collection $standings
         */
        foreach ($finalStandings as $groupId => $standings) {
            /** @var ?Group $group */
            if ( ! $group = $groupsNotCompleted->get($groupId)) {
                continue;
            }

            $standings = $standings
                ->sortBy("position")
                ->map(function ($row) use ($teamExtIdToId) {
                    return $teamExtIdToId[$row['team_ext_id']];
                });

            $group->standings = $standings->toJson();
            $group->save();

            Log::debug("updated final standings of group \"{$group->name}\"");

            $group->calculateBets();
            $this->updateLeaderboards->handle($competition, null, "{\"group\":$group->id}");
        }
    }
}