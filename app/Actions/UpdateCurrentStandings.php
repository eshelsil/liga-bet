<?php

namespace App\Actions;

use App\Competition;
use App\CurrentStanding;
use App\Group;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Refresh the live current_standings rows for every group of a competition, from the 365scores
 * standings feed. Runs every update cycle (when games changed) so the table tracks the group in
 * real time — unlike UpdateCompetitionStandings, which writes the final ordering once a group ends.
 *
 * 365scores-only: the per-team stats and the destinationGuaranteed/destinationNum signal driving
 * is_eliminated come from the 365 feed. Football-data competitions are skipped.
 */
class UpdateCurrentStandings
{
    private ?Collection $fakeStandings = null;

    public function fake(?Collection $standings = null)
    {
        $this->fakeStandings = $standings;
    }

    public function handle(Competition $competition)
    {
        if (!$competition->isSourced365()) {
            return; // current standings are sourced from 365 only
        }

        $currentStandings = $this->fakeStandings
            ?? $competition->getCrawler()->fetchCurrentGroupStandings365($competition->get365Id());

        $groupsByExtId = $competition->groups->keyBy("external_id");
        $teamExtIdToId = $competition->teams->pluck("id", "external_id");

        foreach ($currentStandings as $groupExtId => $rows) {
            /** @var ?Group $group */
            if (!$group = $groupsByExtId->get($groupExtId)) {
                continue;
            }

            foreach ($rows as $row) {
                $teamId = $teamExtIdToId[$row['team_ext_id']] ?? null;
                if (is_null($teamId)) {
                    continue; // team we don't track (shouldn't happen for a synced group)
                }

                CurrentStanding::updateOrCreate(
                    ['group_id' => $group->id, 'team_id' => $teamId],
                    [
                        'position'      => $row['position'],
                        'game_played'   => $row['game_played'],
                        'points'        => $row['points'],
                        'goals_for'     => $row['goals_for'],
                        'goals_against' => $row['goals_against'],
                        'goals_diff'    => $row['goals_diff'],
                        'is_eliminated' => $row['is_eliminated'],
                    ]
                );
            }

            Log::debug("updated current standings of group \"{$group->name}\"");
        }
    }
}
