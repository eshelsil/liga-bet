import { BetBase, BetType, Tournament } from '../types'


export function getSideTournamentId(bet: BetBase, tournament: Tournament): number {
    const gameIdToSideTournamentMap = tournament.config.sideTournamentGames ?? {}
    if (bet.type === BetType.Match){
        const gameId = bet.type_id
        return gameIdToSideTournamentMap[gameId] ?? null
    }
    return null
}