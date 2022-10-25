import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MyUtlsById, Tournament, TournamentConfig, UtlWithTournament } from '../types'

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
    },
})

export default myUtls
