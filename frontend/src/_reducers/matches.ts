import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MatchApiModelById } from '../types';


const matches = createSlice({
  name: 'matches',
  initialState: {} as MatchApiModelById,
  reducers: {
    updateMany: (state, action: PayloadAction<MatchApiModelById>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export default matches;