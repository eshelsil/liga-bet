import { AppDispatch, GetRootState } from '../_helpers/store'
import { createTournament, getTournamentsOwnedByUser, updateTournamentScoresConfig, updateTournamentStatus } from '../api/tournaments'
import ownedTournament from '../_reducers/ownedTournament'
import { CurrentTournamentId, CurrentTournamentUserId } from '../_selectors'
import { TournamentScoreConfig, TournamentStatus } from '../types'
import myUtlsSlice from '../_reducers/myUtls'

function createNewTournament({
    name,
    competitionId,
}: {
    name: string
    competitionId: number
}) {
    return async (dispatch: AppDispatch) => {
        const tournament = await createTournament({
            name,
            competition: competitionId,
        })
        dispatch(ownedTournament.actions.set(tournament))
    }
}

function fetchOwnedTournaments() {
    return async (dispatch: AppDispatch) => {
        const tournaments = await getTournamentsOwnedByUser()
        const tournament = tournaments[0]
        dispatch(ownedTournament.actions.set(tournament))
    }
}

function updateScoreConfig(config: TournamentScoreConfig) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const tournament = await updateTournamentScoresConfig(tournamentId, config);
        dispatch(myUtlsSlice.actions.setTournament({utlId, tournament}))
    }
}

function openTournament() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const tournament = await updateTournamentStatus(tournamentId, TournamentStatus.OpenForBets)
        dispatch(myUtlsSlice.actions.setTournament({utlId, tournament}))
    }
}

function revertOpenTournament() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = CurrentTournamentId(getState())
        const tournament = await updateTournamentStatus(tournamentId, TournamentStatus.Initial)
        dispatch(myUtlsSlice.actions.setTournament({utlId, tournament}))
    }
}


export { createNewTournament, fetchOwnedTournaments, updateScoreConfig, openTournament, revertOpenTournament }
