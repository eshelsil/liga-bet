import { Tournament, TournamentStatus } from '../types'

export function isTournamentStarted(tournament: Tournament) {
    return tournament.status !== TournamentStatus.Initial
}
