import { AppDispatch, GetRootState } from '../_helpers/store'
import scoreboardSettings, { ScoreboardConfig } from '../_reducers/scoreboardSettings'
import { CurrentTournamentId } from '../_selectors'


function updateScoreboardSetting<T extends keyof ScoreboardConfig>(key: T, value: ScoreboardConfig[T]) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        dispatch(scoreboardSettings.actions.updateSetting({key, value, tournamentId}))
    }
}

export {
    updateScoreboardSetting,
}
