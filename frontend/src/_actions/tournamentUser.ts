import { getUserUTLs, joinTournament, leaveTournament } from '../api/users';
import { AppDispatch, GetRootState } from '../_helpers/store';
import { CurrentTournamentUserId, TournamentIdSelector } from '../_selectors';
import { MyUtlsById, UtlWithTournament } from '../types';
import tournamentUser from '../_reducers/tournamentUser';
import utlsSlice from '../_reducers/myUtls';


function selectFirstUserIfOnlyOne(
  utlsById: MyUtlsById,
  dispatch: AppDispatch
){
  const utls = Object.values(utlsById);
  if (utls.length === 1) {
    dispatch(tournamentUser.actions.set({id: utls[0].id}))
  }
}



function selectUtl(utlId: number) {
  return tournamentUser.actions.set({id: utlId});
}

function resetUtlSelection() {
  return tournamentUser.actions.reset();
}

function fetchAndStoreUtls() {
  return (dispatch: AppDispatch) => {
      return getUserUTLs()
      .then( (utlsById: MyUtlsById )=> {
        dispatch(utlsSlice.actions.set(utlsById));
        selectFirstUserIfOnlyOne(utlsById, dispatch);
      })
  }
}

function createUtl({
  name,
  tournamentCode,
}: {
  name: string,
  tournamentCode: string,
}) {
  return (dispatch: AppDispatch) => {
      return joinTournament({name, code: tournamentCode})
      .then( (utl: UtlWithTournament )=> {
        dispatch(utlsSlice.actions.add(utl));
        dispatch(selectUtl(utl.id));
      })
  }
}

function currentUtlLeaveTournament() {
  return async (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    const currentUtlId = CurrentTournamentUserId(getState());
    await leaveTournament(tournamentId);
    dispatch(utlsSlice.actions.remove(currentUtlId));
  }
}


export {
  fetchAndStoreUtls,
  selectUtl,
  createUtl,
  resetUtlSelection,
  currentUtlLeaveTournament,
}