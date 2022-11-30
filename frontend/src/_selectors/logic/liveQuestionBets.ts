import { createSelector } from 'reselect'
import { WinnerSpecialQuestionId, RunnerUpSpecialQuestionId, LiveGamesIds, LiveGames, IsRunnerUpBetOn, FormattedSpecialQuestionsScoreConfig } from '../base'
import { KnockoutStage, Team, WinnerSide } from '../../types'
import { getQualifierSide, isTeamParticipate, koStageToNextCompetitionStage, valuesOf } from '../../utils'
import { MatchesWithTeams, QuestionBetsLinked } from '../modelRelations'
import { groupBy, pickBy } from 'lodash'


export const LiveTeamsPLayingKnockout = createSelector(
    LiveGamesIds,
    MatchesWithTeams,
    (liveGameIds, gamesById) => {
        const playingTeams: Record<number, Team> = {};
        for (const gameId of liveGameIds){
            const game = gamesById[gameId]
            if (!game || !game.is_knockout) {
                continue
            }
            const {away_team, home_team} = game
            playingTeams[away_team.id] = away_team
            playingTeams[home_team.id] = home_team
        }
        return playingTeams
    }
)


export const WinnerBetsById = createSelector(
    QuestionBetsLinked,
    WinnerSpecialQuestionId,
    (bets, winnerQuestionId) => {
        return pickBy(bets, bet => bet.type_id === winnerQuestionId)
    }
)
export const LiveWinnerBets = createSelector(
    WinnerBetsById,
    LiveTeamsPLayingKnockout,
    (betsById, playingTeams) => {
        return pickBy(betsById, bet => !!playingTeams[bet.answer.id])
    }
)


export const RunnerUpBetsById = createSelector(
    QuestionBetsLinked,
    RunnerUpSpecialQuestionId,
    (bets, runnerUpQuestionId) => {
        return pickBy(bets, bet => bet.type_id === runnerUpQuestionId)
    }
)

export const LiveRunnerUpBets = createSelector(
    RunnerUpBetsById,
    LiveTeamsPLayingKnockout,
    IsRunnerUpBetOn,
    (betsById, playingTeams, isOn) => {
        if (!isOn) {
            return {}
        }
        return pickBy(betsById, bet => !!playingTeams[bet.answer.id])
    }
)


export const LiveWinnerBetsWithScore = createSelector(
    LiveWinnerBets,
    LiveGames,
    FormattedSpecialQuestionsScoreConfig,
    (liveWinnerBets, liveGamesById, scoresConfig) => {
        const liveGames = valuesOf(liveGamesById)
        return valuesOf(liveWinnerBets).map(
            bet => {
                const answer = bet.answer.id
                const game = liveGames.find(liveGame => isTeamParticipate(liveGame, answer))
                const gameQualifier = getQualifierSide(game)
                let additionalScore = 0
                if (
                    (gameQualifier === WinnerSide.Home && game.home_team === answer)
                    || (gameQualifier === WinnerSide.Away && game.away_team === answer)
                ){
                    const qualifyToStage = koStageToNextCompetitionStage[game.subType as KnockoutStage]
                    additionalScore = scoresConfig.winner[qualifyToStage] ?? 0
                }
                return {
                    ...bet,
                    score: (bet.score || 0) + additionalScore
                }
            }
        )
    }
)

export const LiveRunnerUpBetsWithScore = createSelector(
    LiveRunnerUpBets,
    LiveGames,
    FormattedSpecialQuestionsScoreConfig,
    (liveBets, liveGamesById, scoresConfig) => {
        const liveGames = valuesOf(liveGamesById)
        return valuesOf(liveBets).map(
            bet => {
                const answer = bet.answer.id
                const game = liveGames.find(liveGame => isTeamParticipate(liveGame, answer))
                const gameQualifier = getQualifierSide(game)
                let additionalScore = 0
                if (
                    (gameQualifier === WinnerSide.Home && game.home_team === answer)
                    || (gameQualifier === WinnerSide.Away && game.away_team === answer)
                ){
                    const qualifyToStage = koStageToNextCompetitionStage[game.subType as KnockoutStage]
                    additionalScore = scoresConfig.runnerUp[qualifyToStage] ?? 0
                }
                return {
                    ...bet,
                    score: (bet.score || 0) + additionalScore
                }
            }
        )
    }
)


export const LiveWinnerBetsWithScoreByUtlId = createSelector(
    LiveWinnerBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, 'user_tournament_id')
    }
)

export const LiveRunnerUpBetsWithScoreByUtlId = createSelector(
    LiveRunnerUpBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, 'user_tournament_id')
    }
)
