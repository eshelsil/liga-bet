import { MatchBetApiModel, Team, WinnerSide } from '../types'
import { getWinnerSide } from './matches';

export function getStandingsBetValue(standings: Team[]): string {
    return standings.map((team) => `${team.id}`).join(',')
}

export function getMatchBetValue(matchBet: MatchBetApiModel, isTwoLegsTie = false): string {
    const { result_away, result_home, winner_side } = matchBet
    function mapWinnerSideToIndex(winnerSide: WinnerSide){
        if (winnerSide === WinnerSide.Home) return 1;
        if (winnerSide === WinnerSide.Away) return 3;
        return 2;
    }
    const winnerBet = getWinnerSide(result_home, result_away)
    const qualifierBet = isTwoLegsTie ? winner_side : (winnerBet ? winnerBet : winner_side)
    const winnerIndex = mapWinnerSideToIndex(winnerBet)
    const qualifierIndex = mapWinnerSideToIndex(qualifierBet)
    return `${winnerIndex}||${result_home}-${result_away}||${qualifierIndex}`
}
