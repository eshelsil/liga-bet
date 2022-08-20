import { getUserUTLs, joinTournament } from '../api/users';
import tournamentUser from '../_reducers/tournamentUser';
import {AppDispatch} from '../_helpers/store';
import { MyUtlsById, UtlWithTournament } from '../types';
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


export {
  fetchAndStoreUtls,
  selectUtl,
  createUtl,
  resetUtlSelection,
}