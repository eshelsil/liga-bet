import { BetBase, ScoreboardRow } from '../types'

export function sumBetsScore(bets: BetBase[]) {
    return bets.reduce((sum, bet) => sum + (bet.score ?? 0), 0)
}

export function getRankDisplayById(rows: ScoreboardRow[]) {
    const rankDisplayById = {} as Record<number, string>
    let lastRank = 0
    for (const row of rows) {
        const { rank, id } = row
        if (lastRank === row.rank) {
            rankDisplayById[id] = '-'
        } else {
            lastRank = rank
            rankDisplayById[id] = `${rank}.`
        }
    }
    return rankDisplayById
}
