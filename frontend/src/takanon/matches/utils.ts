import { GameBetBonusesScoreConfig, GameBetScoreConfig, KnockoutStage } from '../../types'
import { getWinnerSide } from '../../utils'
import { sum, sumBy } from 'lodash'

export function getFullTimeString(
    fullTime: number[],
    homeTeam: string,
    awayTeam: string
) {
    const [homeGoals, awayGoals] = fullTime
    if (homeGoals === awayGoals) {
        return `${homeGoals}-${awayGoals} בתום 90 דקות`
    }
    const winnerTeam = homeGoals > awayGoals ? homeTeam : awayTeam
    return `${winnerTeam} מנצחת ${homeGoals}-${awayGoals}`
}

export function getExtraTimeString(
    extraTime: number[],
    homeTeam: string,
    awayTeam: string
) {
    const [homeGoals, awayGoals] = extraTime
    if (homeGoals === awayGoals) {
        return `${homeGoals}-${awayGoals} בתום 120 דקות`
    }
    const winnerTeam = homeGoals > awayGoals ? homeTeam : awayTeam
    return `לאחר הארכה ${winnerTeam} מנצחת ${homeGoals}-${awayGoals}`
}

export function getPenaltiesString(
    penalties: number[],
    homeTeam: string,
    awayTeam: string
) {
    const [homeGoals, awayGoals] = penalties
    const winnerTeam = homeGoals > awayGoals ? homeTeam : awayTeam
    return `${winnerTeam} מנצחת ${homeGoals}-${awayGoals} בפנדלים`
}

export function getQualifier(
    fullTime: number[],
    extraTime?: number[],
    penalties?: number[]
) {
    const fullTimeWinnerSide = getWinnerSide(fullTime[0], fullTime[1])
    if (fullTimeWinnerSide) {
        return fullTimeWinnerSide
    }
    const extraTimeWinnerSide = getWinnerSide(extraTime[0], extraTime[1])
    if (extraTimeWinnerSide) {
        return extraTimeWinnerSide
    }
    return getWinnerSide(penalties[0], penalties[1])
}

export function getTotalScore(scoreConfig: GameBetScoreConfig) {
    return sum(Object.values(scoreConfig).map(val => Number(val)))
}

export function getKoScoreSums({scoreConfig, bonuses, isUcl, gamesCount}: {scoreConfig: GameBetScoreConfig, bonuses: GameBetBonusesScoreConfig, isUcl: boolean, gamesCount: number}) : {
    maxScore: number,
    baseGameScore: number,
    qualifier?: number,
}{
    if (isUcl) {
        return getUclKoScoreSums({scoreConfig, bonuses, isUcl, gamesCount})
    }
    const baseGameScore = getTotalScore(scoreConfig)
    const maxBonusesScore = sumBy(
        Object.entries(bonuses),
        ([stage, config]) => getBonusMaxScore(stage as KnockoutStage, config)
    )
    const maxScore = baseGameScore * gamesCount + maxBonusesScore
    return {
        maxScore,
        baseGameScore,
    }
}

export function getUclKoScoreSums({scoreConfig, bonuses, isUcl, gamesCount}: {scoreConfig: GameBetScoreConfig, bonuses: GameBetBonusesScoreConfig, isUcl: boolean, gamesCount: number}) {
    const {qualifier: q = 0, ...basicScoreConfig} = scoreConfig;
    const qualifier = Number(q);
    const baseGameScore = getTotalScore(basicScoreConfig)
    const twoLegsScore = baseGameScore * 2 + qualifier
    const oneLegScore = baseGameScore + qualifier
    const maxBonusesScore = sumBy(
        Object.entries(bonuses),
        ([stage, config]) => getBonusMaxScoreOnUcl(stage as KnockoutStage, config)
    )
    const maxScore = twoLegsScore * Math.floor(gamesCount / 2) + oneLegScore + maxBonusesScore
    return {
        maxScore,
        qualifier,
        baseGameScore
    }
}

export const gameCountByStage = {
    [KnockoutStage.Final]: 1,
    [KnockoutStage.SemiFinal]: 2,
    [KnockoutStage.QuarterFinal]: 4,
    [KnockoutStage.Last16]: 8,
}

export function getBonusMaxScore(stage: KnockoutStage, scoreConfig: GameBetScoreConfig) {
    return gameCountByStage[stage] * getTotalScore(scoreConfig)
}

export function getBonusMaxScoreOnUcl(stage: KnockoutStage, scoreConfig: GameBetScoreConfig) {
    if (stage === KnockoutStage.Final) {
        return getTotalScore(scoreConfig)
    }
    const {qualifier: q = 0, ...basicScoreConfig} = scoreConfig;
    const qualifier = Number(q);
    const baseGameScore = getTotalScore(basicScoreConfig)
    const twoLegsScore = baseGameScore * 2 + qualifier
    return gameCountByStage[stage] * twoLegsScore
}
