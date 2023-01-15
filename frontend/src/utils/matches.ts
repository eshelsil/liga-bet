import { KnockoutStage, MatchApiModel, MatchCommonBase, WinnerSide } from '../types'
import dayjs from 'dayjs'

export function getWinnerSide(homeScore: number, awayScore: number, qualifier?: WinnerSide) {
    if (homeScore > awayScore) {
        return WinnerSide.Home
    }
    if (homeScore < awayScore) {
        return WinnerSide.Away
    }
    return qualifier ? qualifier : null
}

export function isGameUpcoming(game: MatchCommonBase) {
    const now = dayjs()
    const gameStart = dayjs(game.start_time)
    return gameStart.diff(now, 'day') < 2
}

export function isGameStarted(game: MatchCommonBase) {
    // return new Date(game.start_time) < new Date()

    // Demo remove:
    return game.closed_for_bets
}

export function isGameLive(game: MatchCommonBase) {
    return isGameStarted(game) && !game.is_done
}

export function isFinalGame(game: MatchCommonBase) {
    return game.subType === KnockoutStage.Final
}

export function isTeamParticipate(game: MatchApiModel, teamId: number) {
    return game.away_team === teamId || game.home_team === teamId
}

export function getQualifierSide(game: MatchCommonBase) {
    const {is_done, is_knockout, winner_side, result_away, result_home, full_result_home, full_result_away} = game
    if (!is_knockout){
        return null
    }
    if (is_done) {
        return winner_side 
    }
    const regularTimeWinner = getWinnerSide(result_home, result_away)
    if (regularTimeWinner) {
        return regularTimeWinner
    }
    if (typeof result_home === 'number' && typeof result_away === 'number'){
        const fullTimeWinner = getWinnerSide(full_result_home, full_result_away)
        if (fullTimeWinner) {
            return fullTimeWinner
        }
    }
    return null
}
