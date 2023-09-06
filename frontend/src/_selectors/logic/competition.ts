import { sortBy } from 'lodash';
import { createSelector } from 'reselect'
import { MatchesWithTeams } from '../modelRelations';
import { OpenCompetitions } from '../base';
import { keysOf } from '../../utils';

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

export const HasOpenCompetitions = createSelector(
    OpenCompetitions,
    (openComps) => {
        return keysOf(openComps).length > 0;
    }
)
