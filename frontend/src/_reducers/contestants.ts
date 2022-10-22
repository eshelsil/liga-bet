import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UTLsById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<UTLsById>

interface SetPayload {
    tournamentId: number,
    utls: UTLsById,
}

const contestants = createSlice({
    name: 'contestants',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const {tournamentId, utls} = action.payload
            state[tournamentId] = utls
        },
    },
})

export default contestants
