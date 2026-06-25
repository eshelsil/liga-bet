import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BracketGame } from '../types'

// Knockout bracket ties, keyed by tournament id (contract D, flat list).
type State = Record<number, BracketGame[]>

interface SetPayload {
    tournamentId: number
    games: BracketGame[]
}

const bracket = createSlice({
    name: 'bracket',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const { tournamentId, games } = action.payload
            state[tournamentId] = games
        },
    },
})

export default bracket
