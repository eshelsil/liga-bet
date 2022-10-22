import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BetApiModel, BetsApiModelById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<BetsApiModelById>

interface SetManyPayload {
    tournamentId: number,
    bets: BetsApiModelById,
}

interface SetOnePayload {
    tournamentId: number,
    bet: BetApiModel,
}

const bets = createSlice({
    name: 'bets',
    initialState: {} as State,
    reducers: {
        updateMany: (state, action: PayloadAction<SetManyPayload>) => {
            const { tournamentId, bets } = action.payload
            state[tournamentId] = {
                ...state[tournamentId],
                ...bets,
            }
        },
        updateOne: (state, action: PayloadAction<SetOnePayload>) => {
            const { tournamentId, bet } = action.payload
            state[tournamentId] = {
                ...state[tournamentId],
                [bet.id]: bet,
            }
        },
    },
})

export default bets
