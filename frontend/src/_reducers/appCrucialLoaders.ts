import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type State = Record<string, boolean>

const appCrucialLoaders = createSlice({
    name: 'appCrucialLoaders',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<{name: string, isLoading: boolean}>) => {
            const {name, isLoading} = action.payload
            state[name] = isLoading
        },
    },
})

export default appCrucialLoaders
