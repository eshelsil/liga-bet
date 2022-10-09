import { BetBase } from '../types'

export function sumBetsScore(bets: BetBase[]) {
    return bets.reduce((sum, bet) => sum + (bet.score ?? 0), 0)
}
