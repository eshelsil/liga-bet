import { mapValues, orderBy } from 'lodash';
import { createSelector } from 'reselect';
import { ScoreboardRow } from '../../types';
import { LeaderboardVersions } from '../base';

export const LeaderboardVersionsDesc = createSelector(
    LeaderboardVersions,
    (versions) => {
        return orderBy(Object.values(versions), 'created_at', 'desc');
    }
);

export const LatestLeaderboard = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        const latestVersion = versions[0];
        if (!latestVersion) return {};
        const prevVersion = versions[1];
        const prevVersionContestantsById = prevVersion.leaderboard ?? {};
        const constestantsById = latestVersion.leaderboard;
        return mapValues(constestantsById, (contestant: ScoreboardRow) => {
            const contestantOnPrevVersion = prevVersionContestantsById[contestant.user_tournament_id];
            const {rank, score} = contestant;
            const {rank: prevRank, score: prevScore} = contestantOnPrevVersion ?? {};
            return {
                ...contestant,
                addedScore: score - (prevScore ?? 0),
                change: prevRank ? prevRank - rank : 0,
            }
        });
    }
);