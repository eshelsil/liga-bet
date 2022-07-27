export function sumBetsScore(bets){
    return bets.reduce(
        (sum, bet) => (sum + (bet.score ?? 0)),
        0,
    );
}