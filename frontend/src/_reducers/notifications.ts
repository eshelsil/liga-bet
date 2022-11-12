import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NotificationsByTournamentId } from '../types'


type State = NotificationsByTournamentId

const notifications = createSlice({
    name: 'notifications',
    initialState: {} as State,
    reducers: {
        update: (state, action: PayloadAction<State>) => ({
            ...state,
            ...action.payload,
        })
    },
})

export default notifications
