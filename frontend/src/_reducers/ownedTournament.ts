import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Tournament } from '../types'

const ownedTournament = createSlice({
    name: 'ownedTournament',
    initialState: {} as Tournament,
    reducers: {
        set: (state, action: PayloadAction<Tournament>) =>
            action.payload ?? state,
    },
})

export default ownedTournament
