import { MatchCommonBase, WinnerSide } from '../types'
import dayjs from 'dayjs'

export function getWinnerSide(homeScore: number, awayScore: number) {
    if (homeScore > awayScore) {
        return WinnerSide.Home
    }
    if (homeScore < awayScore) {
        return WinnerSide.Away
    }
    return null
}

export function isGameUpcoming(game: MatchCommonBase) {
    const now = dayjs()
    const gameStart = dayjs(game.start_time)
    return gameStart.diff(now, 'day') < 2
}

export function isGameStarted(game: MatchCommonBase) {
    return new Date(game.start_time) < new Date()
}
