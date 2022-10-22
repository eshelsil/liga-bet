import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MatchApiModelById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<MatchApiModelById>

interface UpdateManyPayload {
    competitionId: number,
    games: MatchApiModelById,
}


const matches = createSlice({
    name: 'matches',
    initialState: {} as State,
    reducers: {
        updateMany: (state, action: PayloadAction<UpdateManyPayload>) => {
            const {competitionId, games} = action.payload
            state[competitionId] = {
                ...(state[competitionId] ?? {}),
                ...games,
            }
        },
    },
})

export default matches
