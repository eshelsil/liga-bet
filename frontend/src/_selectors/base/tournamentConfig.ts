import { cloneDeep, isEmpty } from 'lodash';
import { createSelector } from 'reselect'
import { SpecialQuestionType } from '../../types';
import { formatGameBetsConfig, formatTopAssistsConfig, generateDefaultScoresConfig, generateEmptyScoresConfig, isQuestionBetEmpty } from '../../utils';
import {
    CurrentSideTournament,
    CurrentTournament,
} from './models'


export const CurrentTournamentConfig = createSelector(
    CurrentTournament,
    tournament => tournament.config,
);

// Contract F — bracket scoring (present only for knockout_bracket tournaments).
export const BracketScoresConfigSelector = createSelector(
    CurrentTournamentConfig,
    (config) => config?.scores?.bracket,
)

export const PrizesSelector = createSelector(
    CurrentTournamentConfig,
    CurrentSideTournament,
    (config, sideTournament) => {
        if (sideTournament?.config?.prizes){
            return sideTournament.config.prizes
        }
        return config?.prizes ?? []
    }
)

export const ScoresConfigSelector = createSelector(
    CurrentTournamentConfig,
    (config) => {
        const scoresConfig = config?.scores
        if (!scoresConfig) return undefined
        // knockout_bracket tournaments serialize only `scores.bracket` — `specialBets`
        // (and the other classic sections) are absent, so guard the topAssists access.
        // Spreading an absent `specialBets` is a no-op; the empty result is dropped
        // downstream in BetsFullScoresConfigSelector.
        return {
            ...scoresConfig,
            specialBets: {
                ...scoresConfig.specialBets,
                topAssists: formatTopAssistsConfig(scoresConfig.specialBets?.topAssists ?? 0)
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

        // For knockout_bracket the classic sections are absent — fill them with a
        // zeroed config so the shared classic scoring contributes 0 (never throws).
        const emptyConfig = generateEmptyScoresConfig()
        scoreConfig.gameBets = scoreConfig.gameBets ?? emptyConfig.gameBets
        scoreConfig.groupRankBets = scoreConfig.groupRankBets ?? emptyConfig.groupRankBets
        scoreConfig.specialBets = scoreConfig.specialBets ?? emptyConfig.specialBets
        scoreConfig.specialQuestionFlags = scoreConfig.specialQuestionFlags ?? emptyConfig.specialQuestionFlags

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

export const IsQualifierBetOn = createSelector(
    FormattedMatchBetScoreConfig,
    (config) => config?.knockout?.qualifier > 0
)

export const IsRunnerUpBetOn = createSelector(
    FormattedSpecialQuestionsScoreConfig,
    (config) => !!config?.runnerUp
)

export const IsTopAssistsBetOn = createSelector(
    FormattedSpecialQuestionsScoreConfig,
    (config) => config?.topAssists?.eachGoal > 0 || config?.topAssists?.correct > 0
)

export const IsMvpBetOn = createSelector(
    FormattedSpecialQuestionsScoreConfig,
    (config) => config?.mvp > 0
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

export const IsOnAutoBet = createSelector(
    TournamentPreferences,
    (prefs) => !!prefs?.enable_auto_bet
)