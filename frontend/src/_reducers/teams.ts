import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TeamsById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<TeamsById>

interface SetPayload {
    competitionId: number,
    teams: TeamsById,
}

const teams = createSlice({
    name: 'teams',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const {competitionId, teams} = action.payload
            state[competitionId] = teams
        },
    },
})

export default teams