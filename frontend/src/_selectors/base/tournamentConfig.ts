import { createSelector } from 'reselect'
import {
    CurrentTournament,
} from './models'


export const CurrentTournamentConfig = createSelector(
    CurrentTournament,
    tournament => tournament.config,
);

export const PrizesSelector = createSelector(
    CurrentTournamentConfig,
    (config) => config?.prizes ?? []
)

export const ScoresConfigSelector = createSelector(
    CurrentTournamentConfig,
    (config) => config?.scores
)

export const TournamentStatusSelector = createSelector(
    CurrentTournament,
    (tournament) => tournament?.status
)