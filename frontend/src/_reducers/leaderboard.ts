import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ScoreboardRow } from '../types';
import { LeaderboardVersion } from '../types';


const leaderboard = createSlice({
  name: 'leaderboard',
  initialState: [] as ScoreboardRow[],
  reducers: {
    set: (state, action: PayloadAction<LeaderboardVersion[]>) => action.payload[0].leaderboard,
  },
});

export default leaderboard;