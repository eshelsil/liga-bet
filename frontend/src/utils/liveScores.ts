import { GameBetScoreConfig, GameGoalsData, GameGoalsDataById, LeaderboardVersion, MatchBetWithRelations, QuestionBetWithRelations, SpecialQuestionType } from '../types'
import { cloneDeep, keyBy, mapValues, orderBy } from 'lodash'
import { calcLeaderboardVersionsDiff } from './leaderboard'
import { ScoresConfigFromatted } from '../_selectors'
import { getWinnerSide, isGameLive } from './matches'
import { valuesOf } from './common'


export function getLiveVersionScore(currentVersion: LeaderboardVersion, addedScoreByUtlId: Record<number, number>){
    const newLeaderboard = mapValues(cloneDeep(currentVersion.leaderboard), (row, utlId) => {
        const score = row.score + (addedScoreByUtlId[utlId] ?? 0);
        return {
            ...row,
            score,
        }
    })
    let lastScore: number
    let lastRank: number
    for (const [index, row] of Object.entries(orderBy(valuesOf(newLeaderboard), 'score', 'desc'))) {
        if (lastRank === undefined) {
            lastRank = 1
        } else if (lastScore !== row.score) {
            lastRank = 1 + Number(index)
        }
        row.rank = lastRank
        lastScore = row.score
    }
    const liveVersion = {
        ...currentVersion,
        leaderboard: newLeaderboard,
    }
    return calcLeaderboardVersionsDiff(liveVersion, currentVersion)
}


export function calcLiveAddedScore({
    betsByUtlId,
    goalsData,
    questionBetsByUtlId,
    config
}: {
    betsByUtlId: Record<number, MatchBetWithRelations[]>,
    goalsData: GameGoalsDataById,
    questionBetsByUtlId: Record<number, QuestionBetWithRelations[]>,
    config: ScoresConfigFromatted
}){
    return mapValues(betsByUtlId, (matchBets, utlId): number => {
        const questionBets: QuestionBetWithRelations[] = questionBetsByUtlId[utlId] ?? [] 
        const topScorerId = questionBets.find((bet) => bet.relatedQuestion.type === SpecialQuestionType.TopScorer)?.answer?.id
        const topAssistsId = questionBets.find((bet) => bet.relatedQuestion.type === SpecialQuestionType.TopAssists)?.answer?.id
        const liveMatchBets = matchBets.filter(bet => isGameLive(bet.relatedMatch))
        let addedScore = 0;
        for (const gameBet of liveMatchBets ){
            const gameId = gameBet.relatedMatch.id
            const goalsDataRows = goalsData[gameId] ?? []
            addedScore += calcTotalPointsGainedOnGame({
                bet: gameBet,
                goalsDataRows,
                topAssistsId,
                topScorerId,
                config,
            })
        }
        return addedScore
    })
    
}



export function calcTotalPointsGainedOnGame({
    bet,
    goalsDataRows,
    topScorerId,
    topAssistsId,
    config,
}: {
    bet: MatchBetWithRelations
    goalsDataRows: GameGoalsData[]
    topScorerId: number
    topAssistsId: number
    config: ScoresConfigFromatted
}){
    // TODO: handle on KO
    const gameScore = calcGainedPointsOnGameBet(bet, config.gameBets.groupStage)

    const specialBetsScore = calcGainedPointsOnGameGoals({
        goalsDataByPlayerId: keyBy(goalsDataRows, 'playerId'),
        scoreConfig:{
            goal: config.specialBets.topScorer.eachGoal,
            assist: config.specialBets.topAssists?.eachGoal,
        },
        topScorer: topScorerId,
        topAssists: topAssistsId,
    })
    return gameScore + specialBetsScore
}


export function calcGainedPointsOnGameBet(bet: MatchBetWithRelations, config: GameBetScoreConfig){
    let score = 0;
    const {relatedMatch: game, result_home: bet_home, result_away: bet_away} = bet
    const {result_home, result_away} = game
    if (result_home === bet_home && result_away === bet_away){
        score += config.result
    }
    if (getWinnerSide(result_home, result_away) === getWinnerSide(bet_home, bet_away)){
        score += config.winnerSide
    }
    return score;
}



export function calcGainedPointsOnGameGoals({
    goalsDataByPlayerId,
    scoreConfig,
    topScorer,
    topAssists,
}: {
    goalsDataByPlayerId: Record<number, GameGoalsData>,
    scoreConfig: {
        goal: number,
        assist: number,
    },
    topScorer: number,
    topAssists: number,
}){
    const topScorerData = goalsDataByPlayerId[topScorer]
    const topAssistsData = goalsDataByPlayerId[topAssists]

    let score = 0;
    if (topScorerData) {
        score += scoreConfig.goal * (topScorerData?.goals || 0)
    }
    if (topAssistsData) {
        score += scoreConfig.assist * (topAssistsData?.goals || 0)
    }
    return score
}