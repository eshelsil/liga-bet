import { AppDispatch } from '../_helpers/store';
import { createTournament, getTournamentsOwnedByUser } from '../api/tournaments';
import ownedTournament from '../_reducers/ownedTournament';


function createNewTournament ({
  name,
  competitionId,
}: {
  name: string,
  competitionId: number,
}) {
  return async (dispatch: AppDispatch) => {
      const tournament = await createTournament({name, competition: competitionId});
      dispatch(ownedTournament.actions.set(tournament));
  }
}

function fetchOwnedTournaments () {
  return async (dispatch: AppDispatch) => {
      const tournaments = await getTournamentsOwnedByUser();
      const tournament = tournaments[0];
      dispatch(ownedTournament.actions.set(tournament));
  }
}


export {
  createNewTournament,
  fetchOwnedTournaments,
}