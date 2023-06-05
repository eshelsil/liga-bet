import { GameBetScoreConfig, MatchBetsScoreConfig, MatchBetWithRelations, ScoreboardRowById } from '../types'
import { mapValues, orderBy } from 'lodash'
import { ScoresConfigFromatted } from '../_selectors'
import { getQualifierSide, getWinnerSide, isGameLive } from './matches'
import { valuesOf } from './common'


export function getLiveVersionScore(currentLeaderboard: ScoreboardRowById, addedScoreByUtlId: Record<number, number>){
    const liveLeaderboard = mapValues(currentLeaderboard, (row, utlId) => {
        const score = row.score + (addedScoreByUtlId[utlId] ?? 0);
        return {
            ...row,
            score,
        }
    })
    let lastScore: number
    let lastRank: number
    for (const [index, row] of Object.entries(orderBy(valuesOf(liveLeaderboard), 'score', 'desc'))) {
        if (lastRank === undefined) {
            lastRank = 1
        } else if (lastScore !== row.score) {
            lastRank = 1 + Number(index)
        }
        row.rank = lastRank
        lastScore = row.score
    }
    return liveLeaderboard
}


export function calcLiveAddedScore({
    betsByUtlId,
    config
}: {
    betsByUtlId: Record<number, MatchBetWithRelations[]>,
    config: ScoresConfigFromatted
}){
    return mapValues(betsByUtlId, (matchBets, utlId): number => {
        const liveMatchBets = matchBets.filter(bet => isGameLive(bet.relatedMatch))
        let addedScore = 0;
        for (const gameBet of liveMatchBets ){
            addedScore += calcGainedPointsOnGameBet(gameBet, config.gameBets)
        }
        return addedScore
    })
}

export function calcGainedPointsOnGameBet(bet: MatchBetWithRelations, config: MatchBetsScoreConfig){
    let score = 0;
    const {relatedMatch: game, result_home: bet_home, result_away: bet_away, winner_side: bet_qualifier} = bet
    const {result_home, result_away, is_knockout, subType} = game
    const scoreConfig = is_knockout ? config.knockout : config.groupStage
    const bonusConfig: GameBetScoreConfig = (is_knockout ? config.bonuses[subType] : undefined) ?? {result: 0,  winnerSide: 0, qualifier: 0}
    if (result_home === bet_home && result_away === bet_away){
        score += scoreConfig.result
        score += bonusConfig.result
    }
    if (getWinnerSide(result_home, result_away) === getWinnerSide(bet_home, bet_away)){
        score += scoreConfig.winnerSide
        score += bonusConfig.winnerSide
    }
    if (
        is_knockout && scoreConfig.qualifier > 0
        && getQualifierSide(game) === getWinnerSide(bet_home, bet_away, bet_qualifier)
    ){
        score += scoreConfig.qualifier
        score += bonusConfig.qualifier
    }
    return score;
}

export function calcGainedPointsOnStandingsBet({
    bet,
    answer,
    scoreConfig,
}: {
    bet: number[],
    answer: number[],
    scoreConfig: {
        perfect: number,
        minorMistake: number,
    },
}){
    let minorMistakesCounter = 0
    for (const i in bet){
        const index = Number(i)
        const teamId = bet[index]
        if (answer[index] === teamId){
            continue
        }

        if (isMinorMistake(index, answer, teamId)) {
            minorMistakesCounter += 1
        } else {
            return 0;
        }

        if (minorMistakesCounter >= 3) {
            return 0;
        }
    }

    if (minorMistakesCounter > 0) {
        return scoreConfig.minorMistake;
    }
    return scoreConfig.perfect;
}



function isMinorMistake(
    index: number,
    finalRanks: number[],
    teamId: number
): boolean {
    return (
        (index + 1 <= 3 && finalRanks[index + 1] === teamId)
        || (index - 1 >= 0 && finalRanks[index - 1] == teamId)
    )
}