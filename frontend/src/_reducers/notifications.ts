import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type NotificationsCoutnByTournamentId = Record<number, number>
type State = NotificationsCoutnByTournamentId

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
