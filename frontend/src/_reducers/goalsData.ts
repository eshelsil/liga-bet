import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { GameGoalsDataById } from '../types'


type State = Record<number, GameGoalsDataById>

interface SetPayload {
    competitionId: number,
    goalsData: GameGoalsDataById,
}

const goalsData = createSlice({
    name: 'goalsData',
    initialState: {} as State,
    reducers: {
        updateMany: (state, action: PayloadAction<SetPayload>) => {
            const {competitionId, goalsData} = action.payload
            state[competitionId] = {
                ...(state[competitionId] ?? {}),
                ...goalsData,
            }
        },
    },
})

export default goalsData
