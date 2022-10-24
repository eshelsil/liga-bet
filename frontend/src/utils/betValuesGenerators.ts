import { MatchBetApiModel, Team } from '../types'

export function getStandingsBetValue(standings: Team[]): string {
    return standings.map((team) => `${team.id}`).join(',')
}

export function getMatchBetValue(matchBet: MatchBetApiModel): string {
    const { result_away, result_home, winner_side } = matchBet
    return `${result_home}-${result_away}${
        winner_side ? `->${winner_side}` : ''
    }`
}
