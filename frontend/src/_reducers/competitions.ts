import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CompetitionsById } from '../types'

const competitions = createSlice({
    name: 'competitions',
    initialState: {} as CompetitionsById,
    reducers: {
        set: (state, action: PayloadAction<CompetitionsById>) => action.payload,
    },
})

export default competitions
