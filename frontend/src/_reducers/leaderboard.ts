import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ScoreboardRow } from '../types';


const leaderboard = createSlice({
  name: 'leaderboard',
  initialState: [] as ScoreboardRow[],
  reducers: {
    set: (state, action: PayloadAction<ScoreboardRow[]>) => action.payload,
  },
});

export default leaderboard;