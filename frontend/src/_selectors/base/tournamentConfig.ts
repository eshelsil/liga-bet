import { cloneDeep, isEmpty } from 'lodash';
import { createSelector } from 'reselect'
import { SpecialQuestionType } from '../../types';
import { generateDefaultScoresConfig, isGameBetScoreConfigEmpty, isQuestionBetEmpty } from '../../utils';
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

export const BetsFullScoresConfigSelector = createSelector(
    ScoresConfigSelector,
    (originalConfig) => {
        const initialConfig = isEmpty(originalConfig)
            ? generateDefaultScoresConfig()
            : originalConfig
        const scoreConfig = cloneDeep(initialConfig)
        
        const hasQalifierBet = scoreConfig.gameBets.knockout.qualifier > 0
        if (!hasQalifierBet) {
            delete scoreConfig.gameBets.knockout.qualifier['qualifier']
        }
        for (const [stage, config] of Object.entries(scoreConfig.gameBets.bonuses)){
            if (!hasQalifierBet) {
                delete config['qualifier']
            }
            if (isGameBetScoreConfigEmpty(config)){
                delete scoreConfig.gameBets.bonuses[stage]
            }
        }

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