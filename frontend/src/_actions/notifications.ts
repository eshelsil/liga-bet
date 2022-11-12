import { AppDispatch, GetRootState } from '../_helpers/store'
import notificationsSlice from '../_reducers/notifications'
import { getTournamentNotifications } from '../api/tournaments'
import { CurrentTournamentId, MissingBetsByType, MyOtherTournaments } from '../_selectors'

function updateCurrentTournamentNotifications() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const missingBets = MissingBetsByType(getState())
        const tournamentId = CurrentTournamentId(getState())
        dispatch(notificationsSlice.actions.update({
            [tournamentId]: missingBets
        }))
    }
}

function fetchAndStoreNotifications() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const otherTournaments = MyOtherTournaments(getState())
        const notifications = await getTournamentNotifications(otherTournaments, true)
        dispatch(notificationsSlice.actions.update(notifications))
    }
}

export { fetchAndStoreNotifications, updateCurrentTournamentNotifications }
