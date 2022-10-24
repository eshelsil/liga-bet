import { createSlice, Dictionary } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'
import { keyBy } from 'lodash'

const users = createSlice({
    name: 'users',
    initialState: {} as Dictionary<User>,
    reducers: {
        set: (state, action: PayloadAction<User[]>) =>
            keyBy(action.payload, 'id'),
        updateOne: (state, action: PayloadAction<User>) => {
            const user = action.payload
            state[user.id] = user
        },
    },
})

export default users
