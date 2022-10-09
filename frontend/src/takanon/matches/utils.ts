import { getWinnerSide } from '../../utils'

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
