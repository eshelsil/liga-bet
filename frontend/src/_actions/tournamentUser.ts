import { getUserUTLs, joinTournament, leaveTournament } from '../api/users'
import { updateMyUTL, PayloadUpdateMyUTL } from '../api/utls'
import { AppDispatch, GetRootState } from '../_helpers/store'
import { CurrentTournamentUserId, CurrentUser, TournamentIdSelector } from '../_selectors'
import { MyUtlsById, User, UserPermissions, UtlWithTournament } from '../types'
import tournamentUser from '../_reducers/tournamentUser'
import utlsSlice from '../_reducers/myUtls'
import { mapValues, minBy } from 'lodash'


const fakeTournamentConfig = (utl) => ({
  ...utl,
  tournament: {
    ...utl.tournament,
    config: {
      gameBets: {
        groupStage: {
          winnerSide: 10,
          result: 20,
        },
        knockout: {
          qualifier: 20,
          winnerSide: 20,
          result: 60,
        },
        final: {
          qualifier: 30,
          winnerSide: 30,
          result: 90,
        },
        semifinal: {
          qualifier: 25,
          winnerSide: 25,
          result: 75,
        }
      },
      groupRankBets: {
        perfect: 60,
        minorMistake: 30,
      },
      specialBets: {
        offensive_team: 50,
        winner: {
          quarterFinal: 20,
          semiFinal: 30,
          final: 30,
          winning: 200,
        },
        runner_up: {
          quarterFinal: 20,
          semiFinal: 20,
          final: 100,
        },
        mvp: 100,
        most_assists: 100,
        top_scorer: {
          correct: 40,
          eachGoal: 20,
        },
      },
      prizes: [
        '2000 ש"ח',
        '800 ש"ח',
        '400 ש"ח',
        '200 ש"ח',
        'במבה וקולה גדול',
      ]
    },
  }
})


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
      // const utlsById = await getUserUTLs();
      let utlsById = await getUserUTLs(); // for development
      utlsById = mapValues(utlsById, fakeTournamentConfig);
      const currentUser = CurrentUser(getState());
      dispatch(utlsSlice.actions.set(utlsById));
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
        dispatch(utlsSlice.actions.setOne(fakeTournamentConfig(utl)));
        dispatch(selectUtl(utl.id));
      })
  }
}

function updateMyUTLAndStore(tournamentId: number, params: PayloadUpdateMyUTL) {
  return async (dispatch: AppDispatch) => {
      const utl = await updateMyUTL(tournamentId, params);
      dispatch(utlsSlice.actions.setOne(fakeTournamentConfig(utl)));
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
