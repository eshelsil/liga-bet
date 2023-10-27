import { AppDispatch, GetRootState } from '../_helpers/store'
import scoreboardSettings, { ScoreboardConfig } from '../_reducers/scoreboardSettings'
import { CurrentTournamentId, LatestLeaderboardVersion, LeaderboardVersionsWithGames, ScoreboardSettings } from '../_selectors'
import { LeaderboardVersionWithGame } from '../types'


function areVersionsParallel(oldVersion: LeaderboardVersionWithGame, newVersion: LeaderboardVersionWithGame){
    const oldGame = oldVersion?.game
    const newGame = newVersion?.game
    if (oldGame === undefined || newGame === undefined){
        return false
    }
    const startedTogether = oldGame.start_time === newGame.start_time
    const oldGameEndTs = Number(new Date(oldGame.end_time))
    const newGameEndTs = Number(new Date(newGame.end_time))
    const endedTogether = Math.abs(newGameEndTs - oldGameEndTs) < 1000 * 60 * 15
    return startedTogether && endedTogether
}

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
        const versions = LeaderboardVersionsWithGames(getState())

        const version = versions.find(v => v.id == lastSeenVersionId)
        const latestVersionWithRelations = versions.find(v => v.id == latestVersion?.id)
        const isParalel = areVersionsParallel(version, latestVersionWithRelations)

        if (settings.upToDateMode && latestVersion?.id !== lastSeenVersionId && version && !isParalel){
            dispatch(scoreboardSettings.actions.updateSetting({key: 'showChange', value: true, tournamentId}))
            dispatch(scoreboardSettings.actions.updateSetting({key: 'originVersion', value: version, tournamentId}))
        }
    }
}

export {
    updateScoreboardSetting,
    showChangeFromLastSeenVersion,
}
