import { createSlice, Dictionary } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TournamentSummaryData } from '../../types'


type State = Dictionary<TournamentSummaryData>

const allTournaments = createSlice({
    name: 'allTournaments',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<State>) => action.payload,
    },
})

export default allTournaments
