import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PlayerApiModelById } from '../types';


const players = createSlice({
  name: 'players',
  initialState: {} as PlayerApiModelById,
  reducers: {
    setMany: (state, action: PayloadAction<PlayerApiModelById>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export default players;