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

export const TournamentPreferences = createSelector(
    CurrentTournament,
    (tournament) => tournament?.preferences
)

export const AnsweredUseDefaultScoreDialog = createSelector(
    TournamentPreferences,
    (prefs) => !!prefs?.use_default_config_answered
)

export const IsOnAutoConfirmUtls = createSelector(
    TournamentPreferences,
    (prefs) => !!prefs?.auto_approve_users
)