import { getUserUTLs, joinTournament, leaveTournament } from '../api/users';
import { updateMyUTL, PayloadUpdateMyUTL } from '../api/utls';
import { AppDispatch, GetRootState } from '../_helpers/store';
import { CurrentTournamentUserId, TournamentIdSelector } from '../_selectors';
import { MyUtlsById, UtlWithTournament } from '../types';
import tournamentUser from '../_reducers/tournamentUser';
import utlsSlice from '../_reducers/myUtls';
import { mapValues } from 'lodash';


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
  return async (dispatch: AppDispatch) => {
      // const utlsById = await getUserUTLs();
      let utlsById = await getUserUTLs(); // for development
      utlsById = mapValues(utlsById, (utl) => ({
        ...utl,
        tournament: {
          ...utl.tournament,
          config: {
            gameBets: {
              group_stage: {
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
              offensiveTeamGroupStage: 50,
              winner: {
                correct: 200,
                levels: {
                  quarterFinal: 20,
                  semiFinal: 30,
                  final: 30,
                  winning: 200,
                },
              },
              runnerUp: {
                levels: {
                  quarterFinal: 20,
                  semiFinal: 20,
                  final: 100,
                },
              },
              mvp: 100,
              mostAssists: 100,
              topScorer: {
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
      }))
      dispatch(utlsSlice.actions.set(utlsById));
      selectFirstUserIfOnlyOne(utlsById, dispatch);
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
        dispatch(utlsSlice.actions.setOne(utl));
        dispatch(selectUtl(utl.id));
      })
  }
}

function updateMyUTLAndStore(tournamentId: number, params: PayloadUpdateMyUTL) {
  return async (dispatch: AppDispatch) => {
      const utl = await updateMyUTL(tournamentId, params);
      dispatch(utlsSlice.actions.setOne(utl));
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
  updateMyUTLAndStore,
}