
import { Action, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface CurrentUtl {
  id: number,
}

const tournamentUser = createSlice({
  name: 'currentUtl',
  initialState: {} as CurrentUtl,
  reducers: {
    set: (state, action: PayloadAction<CurrentUtl>) => action.payload,
    reset: () => ({} as CurrentUtl),
  },
})

export default tournamentUser;