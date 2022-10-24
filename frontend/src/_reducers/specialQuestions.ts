import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SpecialQuestionsApiModelById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<SpecialQuestionsApiModelById>

interface SetPayload {
    tournamentId: number,
    specialQuestions: SpecialQuestionsApiModelById,
}


const specialQuestions = createSlice({
    name: 'specialQuestions',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const {tournamentId, specialQuestions} = action.payload
            state[tournamentId] = specialQuestions
        },
    },
})

export default specialQuestions
