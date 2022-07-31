import { mapValues, pickBy } from 'lodash';
import { createSelector } from 'reselect'
import { Match } from '../../types';
import { Matches, Teams } from '../base';


export const MatchesWithTeams = createSelector(
    Matches,
    Teams,
    (matches, teamsById) => {
        const matchesWithTemas = mapValues(matches, (match): Match => ({
            ...match,
            home_team: teamsById[match.home_team],
            away_team: teamsById[match.away_team],
        }));
        return pickBy(matchesWithTemas, match => (
            match.home_team && match.away_team
        ));
    }
);