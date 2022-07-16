export function getStandingsValue(standings){
    return standings.map(team => team.id).concat(',')
}