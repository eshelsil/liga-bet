import { GameBetScoreConfig, MatchBetWithRelations, Tournament } from '../types'


export function isBetBelongsToSideTournament(bet: MatchBetWithRelations, tournament: Tournament, sideTournamentId?: number): boolean {
    const gameIdToSideTournamentMap = tournament.config.sideTournamentGames ?? {}
    const gameId = bet.type_id
    const sideTournaments = gameIdToSideTournamentMap[gameId]
    if (!sideTournaments){
        return !sideTournamentId
    }
    return sideTournaments.includes(sideTournamentId)
}

export function sortBetSlices(a: keyof GameBetScoreConfig, b: keyof GameBetScoreConfig){
    const order: Array<keyof GameBetScoreConfig> = ['result', 'winnerSide','qualifier'];
    return order.indexOf(a) - order.indexOf(b)
}