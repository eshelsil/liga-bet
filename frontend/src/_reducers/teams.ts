import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TeamsById } from '../types'


const teams = createSlice({
  name: 'teams',
  initialState: {} as TeamsById,
  reducers: {
    set: (state, action: PayloadAction<TeamsById>) => action.payload,
  },
});

export default teams;