export function getStandingsBetValue(standings){
    return standings.map(team => team.id).concat(',')
}

export function getMatchBetValue(matchBet){
    const {result_away, result_home, winner_side} = matchBet;
    return `${result_home}-${result_away}${winner_side ? `->${winner_side}`: ''}`;
}