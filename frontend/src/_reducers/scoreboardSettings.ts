import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardVersion } from '../types'
import { generateDefaultScoreboardSettings } from '../utils'


export interface ScoreboardConfig {
    liveMode: boolean,
    upToDateMode: boolean,
    showChange: boolean,
    originVersion?: LeaderboardVersion,
    destinationVersion?: LeaderboardVersion,   
    expanded?: boolean,
}

export type ScoreboardSettingsState = Record<number, ScoreboardConfig>

export interface UpdateSettingParams<T extends keyof ScoreboardConfig> {
    key: T
    value: ScoreboardConfig[T],
    tournamentId: number,
}

export interface SetFuncPayload extends ScoreboardConfig{
    tournamentId: number
}

export type UpdateSettingFunc = <T extends keyof ScoreboardConfig>(key: T, value: ScoreboardConfig[T]) => void



const scoreboardSettings = createSlice({
    name: 'scoreboardSettings',
    initialState: {} as ScoreboardSettingsState,
    reducers: {
        setTournamentSettings: (state, action: PayloadAction<SetFuncPayload>) => {
            const {tournamentId, ...settings} = action.payload
            state[tournamentId] = settings
        },
        updateSetting: (allTournamentsState, action: PayloadAction<UpdateSettingParams<keyof ScoreboardConfig>>) => {
            const {key, value, tournamentId} = action.payload
            if (!allTournamentsState[tournamentId]){
                allTournamentsState[tournamentId] = generateDefaultScoreboardSettings()
            }
            const state = allTournamentsState[tournamentId]
            const updated: Partial<ScoreboardConfig> = {[key] : value}
            Object.assign(state, updated)
            if (
                (!state.upToDateMode && state.originVersion?.order > state.destinationVersion?.order)
                || !state.showChange
            ){
                state.originVersion = undefined
            }
            if (state.upToDateMode){
                state.destinationVersion = undefined
            }
        },
    },
})

export default scoreboardSettings
