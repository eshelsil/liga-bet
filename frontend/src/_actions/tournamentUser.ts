import { getUserUTLs } from '../api/users';
import tournamentUser from '../_reducers/tournamentUser';
import {AppDispatch} from '../_helpers/store';
import { MyUtlsById } from '../types';
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

function fetchAndStoreUtls() {
  return (dispatch: AppDispatch) => {
      return getUserUTLs()
      .then( (utlsById: MyUtlsById )=> {
        dispatch(utlsSlice.actions.set(utlsById));
        selectFirstUserIfOnlyOne(utlsById, dispatch);
      })
  }
}


export {
  fetchAndStoreUtls,
  selectUtl,
}