import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UTL, UTLsById } from '../types';


const tournamentUTLs = createSlice({
  name: 'tournamentUTLs',
  initialState: {} as UTLsById,
  reducers: {
    set: (state, action: PayloadAction<UTLsById>) => action.payload,
    update: (state, action: PayloadAction<UTL>) => {
      const utl = action.payload;
      state[utl.id] = utl;
    },
    delete: (state, action: PayloadAction<number>) => {
      const utlId = action.payload;
      delete(state[utlId]);
    },
  }
});

export default tournamentUTLs;