import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UTL, UTLsById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<UTLsById>

interface SetPayload {
    tournamentId: number,
    utls: UTLsById,
}

interface SetOnePayload {
    tournamentId: number,
    utl: UTL,
}

const contestants = createSlice({
    name: 'contestants',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const {tournamentId, utls} = action.payload
            state[tournamentId] = utls
        },
        setOne: (state, action: PayloadAction<SetOnePayload>) => {
            const { tournamentId, utl } = action.payload
            if (state[tournamentId]) {
                state[tournamentId][utl.id] = utl
            }
        },
    },
})

export default contestants
