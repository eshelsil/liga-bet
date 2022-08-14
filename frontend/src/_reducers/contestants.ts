import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UTL, UTLsById } from '../types';
import { keyBy } from 'lodash';


const contestants = createSlice({
  name: 'contestants',
  initialState: {} as UTLsById,
  reducers: {
    set: (state, action: PayloadAction<UTL[]>) => {
      return keyBy(action.payload, 'id');
    },
  },
});

export default contestants;