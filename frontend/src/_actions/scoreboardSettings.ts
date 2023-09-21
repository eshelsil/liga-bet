import { AppDispatch, GetRootState } from '../_helpers/store'
import scoreboardSettings, { ScoreboardConfig } from '../_reducers/scoreboardSettings'
import { CurrentTournamentId, LatestLeaderboardVersion, LeaderboardVersions, ScoreboardSettings } from '../_selectors'


function updateScoreboardSetting<T extends keyof ScoreboardConfig>(key: T, value: ScoreboardConfig[T]) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        dispatch(scoreboardSettings.actions.updateSetting({key, value, tournamentId}))
    }
}

function showChangeFromLastSeenVersion(lastSeenVersionId: number) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const settings = ScoreboardSettings(getState())
        const latestVersion = LatestLeaderboardVersion(getState())
        const versions = LeaderboardVersions(getState())
        const version = versions.find(v => v.id == lastSeenVersionId)
        if (settings.upToDateMode && latestVersion?.id !== lastSeenVersionId && version){
            dispatch(scoreboardSettings.actions.updateSetting({key: 'showChange', value: true, tournamentId}))
            dispatch(scoreboardSettings.actions.updateSetting({key: 'originVersion', value: version, tournamentId}))
        }
    }
}

export {
    updateScoreboardSetting,
    showChangeFromLastSeenVersion,
}
