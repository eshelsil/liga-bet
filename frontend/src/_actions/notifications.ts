import { AppDispatch, GetRootState } from '../_helpers/store'
import notificationsSlice from '../_reducers/notifications'
import { getTournamentNotifications } from '../api/tournaments'
import { MyCurrentTournaments } from '../_selectors'


function fetchAndStoreNotifications() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const otherTournaments = MyCurrentTournaments(getState())
        const notifications = await getTournamentNotifications(otherTournaments, true)
        dispatch(notificationsSlice.actions.update(notifications))
    }
}

export { fetchAndStoreNotifications }
