import {AppDispatch, GetRootState} from '../_helpers/store';
import { UTL, UTLsById } from '../types';
import contestantsSlice from '../_reducers/contestants';
import { fetchContestants } from '../api/contestants';
import { TournamentIdSelector } from '../_selectors';



function fetchAndStoreContestants() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchContestants(tournamentId)
      .then( (utls: UTL[] )=> {
        dispatch(contestantsSlice.actions.set(utls));
      })
  }
}


export {
  fetchAndStoreContestants,
}