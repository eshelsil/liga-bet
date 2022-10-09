import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'

const currentUser = createSlice({
    name: 'currentUser',
    initialState: {} as User,
    reducers: {
        set: (state, action: PayloadAction<User>) => action.payload,
    },
})

export default currentUser
