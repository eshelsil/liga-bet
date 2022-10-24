import { AppDispatch, GetRootState } from '../_helpers/store'
import { createTournament, getTournamentsOwnedByUser, updateTournamentScoresConfig } from '../api/tournaments'
import ownedTournament from '../_reducers/ownedTournament'
import { CurrentTournamentId, CurrentTournamentUserId } from '../_selectors'
import { TournamentScoreConfig } from '../types'
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
        dispatch(myUtlsSlice.actions.updateTournamentConfig({utlId, config: tournament.config}))
    }
}
export { createNewTournament, fetchOwnedTournaments, updateScoreConfig }
