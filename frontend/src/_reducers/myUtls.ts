import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MyUtlsById } from '../types';


const myUtls = createSlice({
  name: 'myUtls',
  initialState: {} as MyUtlsById,
  reducers: {
    set: (state, action: PayloadAction<MyUtlsById>) => action.payload,
  },
});

export default myUtls;