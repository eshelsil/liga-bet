
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GroupsById } from '../types';


const groups = createSlice({
  name: 'groups',
  initialState: {} as GroupsById,
  reducers: {
    set: (state, action: PayloadAction<GroupsById>) => action.payload,
  },
});

export default groups;