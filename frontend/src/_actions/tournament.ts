import { AppDispatch, GetRootState } from '../_helpers/store'
import { createTournament, getTournamentsOwnedByUser } from '../api/tournaments'
import ownedTournament from '../_reducers/ownedTournament'
import { CurrentTournamentUserId } from '../_selectors'
import { TournamentConfig } from '../types'
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

function updateTournamentConfig(config: Partial<TournamentConfig>) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())

        dispatch(myUtlsSlice.actions.updateTournamentConfig({utlId, config}))
    }
}
export { createNewTournament, fetchOwnedTournaments, updateTournamentConfig }
