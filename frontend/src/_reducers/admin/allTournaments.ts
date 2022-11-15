import { createSlice, Dictionary } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DetailedTournamentData } from '../../types'


type State = Dictionary<DetailedTournamentData>

const allTournaments = createSlice({
    name: 'allTournaments',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<State>) => action.payload,
    },
})

export default allTournaments
