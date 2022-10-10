import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const usersTotalCount = createSlice({
    name: 'usersTotalCount',
    initialState: null as number,
    reducers: {
        set: (state, action: PayloadAction<number>) => action.payload,
    },
})

export default usersTotalCount
