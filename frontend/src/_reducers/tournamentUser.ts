
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


const tournamentUser = createSlice({
  name: 'currentUtl',
  initialState: {} as {id: number},
  reducers: {
    set: (state, action: PayloadAction<{id: number}>) => action.payload,
  },
})

export default tournamentUser;