import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UTLsById } from '../types';


const utls = createSlice({
  name: 'utls',
  initialState: {} as UTLsById,
  reducers: {
    set: (state, action: PayloadAction<UTLsById>) => action.payload,
  },
});

export default utls;