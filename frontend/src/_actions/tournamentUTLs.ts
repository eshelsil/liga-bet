import {AppDispatch, GetRootState} from '../_helpers/store';
import { TournamentIdSelector } from '../_selectors';
import { fetchUTLs, removeUTL, PayloadUpdateUTL, updateUTL } from '../api/utls';
import tournamentUTLs from '../_reducers/tournamentUTLs';
import { UtlRole } from '../types';
import { keyBy } from 'lodash';


function fetchAndStoreTournamentUtls() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchUTLs(tournamentId)
      .then( (utls)=> {
        dispatch(tournamentUTLs.actions.set(keyBy(utls, 'id')));
      })
  }
}

function updateAndStoreUTL(utlId: number, data: PayloadUpdateUTL) {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return updateUTL(tournamentId, utlId, data)
      .then( (utl)=> {
        dispatch(tournamentUTLs.actions.update(utl));
      })
  }
}

function removeAndStoreUTL(utlId: number) {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return removeUTL(tournamentId, utlId)
      .then( ()=> {
        dispatch(tournamentUTLs.actions.delete(utlId));
      })
  }
}

function makeManager(utlId: number){
  return updateAndStoreUTL(utlId, {role: UtlRole.Manager});
}

function makeContestant(utlId: number){
  return updateAndStoreUTL(utlId, {role: UtlRole.Contestant});
}


export {
  fetchAndStoreTournamentUtls,
  removeAndStoreUTL,
  makeContestant,
  makeManager,
}