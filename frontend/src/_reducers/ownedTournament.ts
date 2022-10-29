import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Tournament } from '../types'

type State = Record<number, Tournament>

const ownedTournaments = createSlice({
    name: 'ownedTournaments',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<State>) => action.payload,
        updateOne: (state, action: PayloadAction<Tournament>) => ({
            ...state,
            [action.payload.id]: action.payload,
        })
    },
})

export default ownedTournaments
