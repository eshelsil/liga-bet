import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PlayerApiModelById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<PlayerApiModelById>

interface SetPayload {
    competitionId: number,
    players: PlayerApiModelById,
}

const players = createSlice({
    name: 'players',
    initialState: {} as State,
    reducers: {
        setMany: (state, action: PayloadAction<SetPayload>) => {
            const {competitionId, players} = action.payload
            state[competitionId] = {
                ...(state[competitionId] ?? {}),
                ...players,
            }
        },
    },
})

export default players
