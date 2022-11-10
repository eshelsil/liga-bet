import { GameBetScoreConfig, KnockoutStage } from '../../types'
import { getWinnerSide } from '../../utils'
import { sum } from 'lodash'

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

export const gameCountByStage = {
    [KnockoutStage.Final]: 1,
    [KnockoutStage.SemiFinal]: 2,
    [KnockoutStage.QuarterFinal]: 4,
    [KnockoutStage.Last16]: 8,
}

export function getBonusMaxScore(stage: KnockoutStage, scoreConfig: GameBetScoreConfig) {
    return gameCountByStage[stage] * getTotalScore(scoreConfig)
}
