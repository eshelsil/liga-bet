import { sortBy } from 'lodash';
import { createSelector } from 'reselect'
import { MatchesWithTeams } from '../modelRelations';

export const FirstGame = createSelector(
    MatchesWithTeams,
    (games) => {
        return sortBy(games, (game => game.start_time))[0];
    }
)

export const CompetitionStartTime = createSelector(
    FirstGame,
    (firstGame) => {
        return firstGame?.start_time;
    }
)
