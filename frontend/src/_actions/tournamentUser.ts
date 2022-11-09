import { getUserUTLs, joinTournament, leaveTournament } from '../api/users'
import { updateMyUTL, PayloadUpdateMyUTL } from '../api/utls'
import { AppDispatch, GetRootState } from '../_helpers/store'
import { CurrentTournamentUserId, CurrentUser, TournamentIdSelector } from '../_selectors'
import { MyUtlsById, User, UserPermissions, UtlWithTournament } from '../types'
import tournamentUser from '../_reducers/tournamentUser'
import utlsSlice from '../_reducers/myUtls'
import contestantsSlice from '../_reducers/contestants'
import { minBy, omit } from 'lodash'



function getDefaultUtlId(
  utlsById: MyUtlsById,
  currentUser: User
){
  const utls = Object.values(utlsById);
  if (utls.length === 0) {
    return
  }
  const lastStoredUtlId = localStorage.getItem('ligaBetSelectedUtl')
  if (lastStoredUtlId){
    const utl = utlsById[Number(lastStoredUtlId)];
    if(utl) {
      return utl.id
    }
  }
  if (currentUser.permissions === UserPermissions.TournamentAdmin) {
    const utlOfMyOwnTournament = utls.find(utl => utl.tournament.creatorUserId === currentUser.id);
    if (utlOfMyOwnTournament) {
      return utlOfMyOwnTournament.id
    }
    return
  }
  if (utls.length === 1) {
    return utls[0].id
  }
  const firstUtl = minBy(utls, 'createdAt')
  return firstUtl.id
}

function selectUtl(utlId: number) {
  localStorage.setItem('ligaBetSelectedUtl', JSON.stringify(utlId))
  return tournamentUser.actions.set({ id: utlId })
}
  
function resetUtlSelection() {
  localStorage.removeItem('ligaBetSelectedUtl')
  return tournamentUser.actions.reset()
}

function fetchAndStoreUtls() {
  return async (dispatch: AppDispatch, getState: GetRootState) => {
      const utlsById = await getUserUTLs();
      dispatch(utlsSlice.actions.set(utlsById));
      const currentUser = CurrentUser(getState());
      const utlIdToSelect = getDefaultUtlId(utlsById, currentUser);
      if (utlIdToSelect){
        dispatch(selectUtl(utlIdToSelect));
      }
  }
}

function createUtl({
    name,
    tournamentCode,
}: {
    name: string
    tournamentCode: string
}) {
  return async (dispatch: AppDispatch) => {
      return joinTournament({name, code: tournamentCode})
      .then( (utl: UtlWithTournament )=> {
        dispatch(utlsSlice.actions.setOne(utl));
        dispatch(selectUtl(utl.id));
      })
  }
}

function updateMyUTLAndStore(tournamentId: number, params: PayloadUpdateMyUTL) {
  return async (dispatch: AppDispatch) => {
      const utl = await updateMyUTL(tournamentId, params);
      dispatch(utlsSlice.actions.setOne(utl));
      dispatch(contestantsSlice.actions.setOne(
        {
          tournamentId,
          utl: {
            ...omit(utl, ['tournament']),
            tournament_id: utl.tournament.id,
          }
        }
      ));
  }
}

function currentUtlLeaveTournament() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const currentUtlId = CurrentTournamentUserId(getState())
        await leaveTournament(tournamentId)
        dispatch(resetUtlSelection())
        dispatch(utlsSlice.actions.remove(currentUtlId))
    }
}

export {
    fetchAndStoreUtls,
    selectUtl,
    createUtl,
    resetUtlSelection,
    currentUtlLeaveTournament,
    updateMyUTLAndStore,
}
