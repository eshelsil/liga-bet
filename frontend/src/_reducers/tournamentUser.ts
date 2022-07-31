
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UTL } from '../types'


const tournamentUser = createSlice({
  name: 'currentUtl',
  initialState: {} as UTL,
  reducers: {
    set: (state, action: PayloadAction<UTL>) => action.payload,
  },
})

export default tournamentUser;