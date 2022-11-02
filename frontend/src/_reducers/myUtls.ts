import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MyUtlsById, Tournament, TournamentPreferences, UtlWithTournament } from '../types'

const myUtls = createSlice({
    name: 'myUtls',
    initialState: {} as MyUtlsById,
    reducers: {
        set: (state, action: PayloadAction<MyUtlsById>) => action.payload,
        setOne: (state, action: PayloadAction<UtlWithTournament>) => {
            const newUtl = action.payload
            state[newUtl.id] = newUtl
        },
        remove: (state, action: PayloadAction<number>) => {
            const utlId = action.payload
            delete state[utlId]
        },
        setTournament: (state, action: PayloadAction<{utlId: number, tournament: Tournament}>) => {
            const {utlId, tournament} = action.payload
            state[utlId].tournament = tournament
        },
        setTournamentPreferences: (state, action: PayloadAction<{utlId: number, preferences: TournamentPreferences}>) => {
            const {utlId, preferences} = action.payload
            state[utlId].tournament = {
                ...state[utlId].tournament,
                preferences,
            }
        },
    },
})

export default myUtls
