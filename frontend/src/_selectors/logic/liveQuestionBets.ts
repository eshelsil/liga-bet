import { createSelector } from 'reselect'
import { WinnerSpecialQuestionId, RunnerUpSpecialQuestionId, LiveGamesIds, LiveGames, IsRunnerUpBetOn, FormattedSpecialQuestionsScoreConfig, TopScorerSpecialQuestionId, TopAssistsSpecialQuestionId, Players, IsTopAssistsBetOn, GameGoalsDataSelector } from '../base'
import { KnockoutStage, MatchCommonBase, SpecialQuestionAnswer, Team, WinnerSide } from '../../types'
import { getQualifierSide, isGameLive, isTeamParticipate, koStageToNextCompetitionStage, valuesOf } from '../../utils'
import { FinalGame, MatchesWithTeams, PlayersWithTeams, QuestionBetsLinked } from '../modelRelations'
import { groupBy, map, mapValues, maxBy, pickBy } from 'lodash'


function isTheFinalGameLive(finalGame?: MatchCommonBase) {
    if (!finalGame){
        return false
    }
    return isGameLive(finalGame)
}

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

interface ScorerData {
    goals: number,
    assists: number,
}

type PlayerGoalsDataById = Record<number, ScorerData>

export const LiveGoalsDataByPlayerId = createSelector(
    LiveGamesIds,
    GameGoalsDataSelector,
    (liveGameIds, goalsDataByGameId) => {
        const liveScorersData: PlayerGoalsDataById = {}
        for (const gameId of liveGameIds){
            const goalsData = goalsDataByGameId[gameId] ?? []
            for (const scorer of goalsData){
                const { playerId, assists, goals } = scorer
                if (!liveScorersData[playerId]){
                    liveScorersData[playerId] = {
                        assists: 0,
                        goals: 0,
                    }
                }
                liveScorersData[playerId].goals += goals
                liveScorersData[playerId].assists += assists
            }
        }
        return liveScorersData
    }
)

export const LiveScorersById = createSelector(
    Players,
    LiveGoalsDataByPlayerId,
    (playersById, liveGoalsDataByPlayerId) => {
        return mapValues(playersById,
            player => {
                const liveGoalsData = liveGoalsDataByPlayerId[player.id]
                return {
                    ...player,
                    goals: player.goals + (liveGoalsData?.goals ?? 0),
                    assists: player.assists + (liveGoalsData?.assists ?? 0),
                }
            }
        )
    }
)

export const LiveTopScorersAnswer = createSelector(
    LiveScorersById,
    (scorersById) => {
        const scorers = valuesOf(scorersById)
        const maxGoals = maxBy(scorers, 'goals')?.goals
        const topScorers = scorers.filter(scorer => scorer.goals == maxGoals)
        return map(topScorers, 'id')
    }
)

export const LiveTopAssistsAnswer = createSelector(
    LiveScorersById,
    (scorersById) => {
        const scorers = valuesOf(scorersById)
        const maxAssists = maxBy(scorers, 'assists')?.assists
        const topASsists = scorers.filter(scorer => scorer.assists == maxAssists)
        return map(topASsists, 'id')
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
    FinalGame,
    (betsById, playingTeams, isOn, finalGame) => {
        if (!isOn) {
            return {}
        }
        if (isTheFinalGameLive(finalGame)){
            return {}
        }
        return pickBy(betsById, bet => !!playingTeams[bet.answer.id])
    }
)


export const TopScorersBetsById = createSelector(
    QuestionBetsLinked,
    TopScorerSpecialQuestionId,
    (bets, specialQuestionId) => {
        return pickBy(bets, bet => bet.type_id === specialQuestionId)
    }
)

export const TopAssistsBetsById = createSelector(
    QuestionBetsLinked,
    TopAssistsSpecialQuestionId,
    (bets, specialQuestionId) => {
        return pickBy(bets, bet => bet.type_id === specialQuestionId)
    }
)

export const LiveTopScorerBets = createSelector(
    TopScorersBetsById,
    FinalGame,
    (betsById, finalGame) => {
        if (!isTheFinalGameLive(finalGame)){
            return {}
        }
        return betsById
    }
)

export const LiveTopAssistsBets = createSelector(
    TopAssistsBetsById,
    IsTopAssistsBetOn,
    FinalGame,
    (betsById, isOn, finalGame) => {
        if (!isOn) {
            return {}
        }
        if (!isTheFinalGameLive(finalGame)){
            return {}
        }
        return betsById
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

export const LiveTopScorerBetsWithScore = createSelector(
    LiveTopScorerBets,
    LiveGoalsDataByPlayerId,
    LiveTopScorersAnswer,
    FormattedSpecialQuestionsScoreConfig,
    (liveBets, liveScorersData, liveTopScorers, scoresConfig) => {
        return valuesOf(liveBets).map(
            bet => {
                const answer = bet.answer.id
                let additionalScore = 0
                const goalsData = liveScorersData[answer]
                if (goalsData){
                    additionalScore += goalsData.goals * scoresConfig.topScorer.eachGoal
                }
                if (liveTopScorers.includes(answer)) {
                    additionalScore += scoresConfig.topScorer.correct
                }
                return {
                    ...bet,
                    score: (bet.score || 0) + additionalScore
                }
            }
        )
    }
)

export const LiveTopAssistsBetsWithScore = createSelector(
    LiveTopAssistsBets,
    LiveGoalsDataByPlayerId,
    LiveTopAssistsAnswer,
    FormattedSpecialQuestionsScoreConfig,
    (liveBets, liveScorersData, liveTopAssists, scoresConfig) => {
        return valuesOf(liveBets).map(
            bet => {
                const answer = bet.answer.id
                let additionalScore = 0
                const goalsData = liveScorersData[answer]
                if (goalsData){
                    additionalScore += goalsData.assists * scoresConfig.topAssists.eachGoal
                }
                if (liveTopAssists.includes(answer)) {
                    additionalScore += scoresConfig.topAssists.correct
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

export const LiveTopScorerBetsWithScoreByUtlId = createSelector(
    LiveTopScorerBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, 'user_tournament_id')
    }
)

export const LiveTopAssistsBetsWithScoreByUtlId = createSelector(
    LiveTopAssistsBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, 'user_tournament_id')
    }
)


export const LiveSpecialAnswers = createSelector(
    LiveTopScorersAnswer,
    LiveTopAssistsAnswer,
    FinalGame,
    PlayersWithTeams,
    WinnerSpecialQuestionId,
    RunnerUpSpecialQuestionId,
    TopScorerSpecialQuestionId,
    TopAssistsSpecialQuestionId,
    (
        topScorerIds,
        topAssistsIds,
        finalGame,
        players,
        winnerSpecialQuestionId,
        runnerUpSpecialQuestionId,
        topScorerSpecialQuestionId,
        topAssistsSpecialQuestionId,
    ) => {
        const answersByQuestionId: Record<number, SpecialQuestionAnswer[]> = {}

        if (isTheFinalGameLive(finalGame)){
            const winnerSide = getQualifierSide(finalGame)
            if (winnerSide === WinnerSide.Home){
                answersByQuestionId[winnerSpecialQuestionId] = [finalGame.home_team]
                answersByQuestionId[runnerUpSpecialQuestionId] = [finalGame.away_team]
            } else if (winnerSide === WinnerSide.Away){
                answersByQuestionId[winnerSpecialQuestionId] = [finalGame.away_team]
                answersByQuestionId[runnerUpSpecialQuestionId] = [finalGame.home_team]
            }
        }

        const topScorers = topScorerIds.map(id => players[id]).filter(player => !!player)
        const topAssists = topAssistsIds.map(id => players[id]).filter(player => !!player)
        if (topScorers.length > 0){
            answersByQuestionId[topScorerSpecialQuestionId] = topScorers
        }
        if (topAssists.length > 0){
            answersByQuestionId[topAssistsSpecialQuestionId] = topAssists
        }

        return answersByQuestionId
    }
)