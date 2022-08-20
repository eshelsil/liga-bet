import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MyUtlsById, UtlWithTournament } from '../types';


const myUtls = createSlice({
  name: 'myUtls',
  initialState: {} as MyUtlsById,
  reducers: {
    set: (state, action: PayloadAction<MyUtlsById>) => action.payload,
    add: (state, action: PayloadAction<UtlWithTournament>) => {
      const newUtl = action.payload;
      state[newUtl.id] = newUtl;
    },
  },
});

export default myUtls;