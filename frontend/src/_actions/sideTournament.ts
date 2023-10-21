import sideTournament from '../_reducers/sideTournament'


function selectSideTournament(sideTournamentId: number) {
  if (!sideTournamentId){
    return sideTournament.actions.reset()
  }
  return sideTournament.actions.set(sideTournamentId)
}


export {
    selectSideTournament,
}
