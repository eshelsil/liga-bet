import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UTLsById } from '../types';


const contestants = createSlice({
  name: 'contestants',
  initialState: {} as UTLsById,
  reducers: {
    set: (state, action: PayloadAction<UTLsById>) => action.payload,
  },
});

export default contestants;