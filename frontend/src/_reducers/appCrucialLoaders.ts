import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { EnumRecord } from '../types'
import { CrucialLoader } from '../types'


type State = EnumRecord<CrucialLoader, boolean>

const appCrucialLoaders = createSlice({
    name: 'appCrucialLoaders',
    initialState: {} as State,
    reducers: {
        set: (state, action: PayloadAction<{name: CrucialLoader, isLoading: boolean}>) => {
            const {name, isLoading} = action.payload
            state[name] = isLoading
        },
    },
})

export default appCrucialLoaders
