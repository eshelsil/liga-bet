import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BetApiModel, BetsApiModelById } from '../types';


const bets = createSlice({
  name: 'specialQuestions',
  initialState: {} as BetsApiModelById,
  reducers: {
    updateMany: (state, action: PayloadAction<BetsApiModelById>) => ({
      ...state,
      ...action.payload,
    }),
    updateOne: (state, action: PayloadAction<BetApiModel>) => {
      const { payload } = action;
      const { id } = payload;
      state[id] = payload;
    },
  },
});

export default bets;