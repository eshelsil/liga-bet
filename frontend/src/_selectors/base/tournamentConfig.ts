import { cloneDeep, isEmpty } from 'lodash';
import { createSelector } from 'reselect'
import { SpecialQuestionType } from '../../types';
import { formatGameBetsConfig, formatTopAssistsConfig, generateDefaultScoresConfig, isQuestionBetEmpty } from '../../utils';
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
    (config) => {
        const scoresConfig = config?.scores
        if (!scoresConfig) return undefined
        return {
            ...scoresConfig,
            specialBets: {
                ...scoresConfig.specialBets,
                topAssists: formatTopAssistsConfig(scoresConfig.specialBets.topAssists)
            }
        }
    }
)

export type ScoresConfigFromatted = ReturnType<typeof ScoresConfigSelector>

export const BetsFullScoresConfigSelector = createSelector(
    ScoresConfigSelector,
    (originalConfig) => {
        const initialConfig = isEmpty(originalConfig)
            ? generateDefaultScoresConfig()
            : originalConfig
        const scoreConfig = cloneDeep(initialConfig)
        
        scoreConfig.gameBets = formatGameBetsConfig(scoreConfig.gameBets)        

        for (const [name, config] of Object.entries(scoreConfig.specialBets)){
            if (!scoreConfig.specialQuestionFlags[name] || isQuestionBetEmpty(name as SpecialQuestionType, config)){
                delete scoreConfig.specialBets[name]
            }
        }

        return scoreConfig
    }
)

export const FormattedGroupRankScoreConfig = createSelector(
    BetsFullScoresConfigSelector,
    (config) => config?.groupRankBets
)

export const FormattedSpecialQuestionsScoreConfig = createSelector(
    BetsFullScoresConfigSelector,
    (config) => config?.specialBets
)

export const FormattedMatchBetScoreConfig = createSelector(
    BetsFullScoresConfigSelector,
    (config) => config?.gameBets
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