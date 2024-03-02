import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NihusGrantById, NotificationsByTournamentId } from '../types'


type State = NihusGrantById

const nihusim = createSlice({
    name: 'nihusim',
    initialState: {} as State,
    reducers: {
        updateMany: (state, action: PayloadAction<NihusGrantById>) => ({
            ...state,
            ...action.payload,
        })
    },
})

export default nihusim
