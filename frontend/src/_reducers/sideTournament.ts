import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


const sideTournament = createSlice({
    name: 'sideTournament',
    initialState: null as number,
    reducers: {
        set: (state, action: PayloadAction<number>) => action.payload,
        reset: () => null,
    },
})

export default sideTournament
