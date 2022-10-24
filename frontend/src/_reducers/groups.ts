import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { GroupsById } from '../types'
import { Dictionary } from 'lodash'


type State = Dictionary<GroupsById>

interface SetPayload {
    competitionId: number,
    groups: GroupsById,
}


const groups = createSlice({
    name: 'groups',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<SetPayload>) => {
            const {competitionId, groups} = action.payload
            state[competitionId] = groups
        },
    },
})

export default groups
