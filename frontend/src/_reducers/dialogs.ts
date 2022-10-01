import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DialogName } from '../dialogs/types';


export type DialogsState = Partial<Record<DialogName, boolean>>


const dialogs = createSlice({
  name: 'dialogs',
  initialState: {} as DialogsState,
  reducers: {
    openDialog: (state, action: PayloadAction<DialogName>) => {
      const name = action.payload;
      state[name] = true;
    },
    closeDialog: (state, action: PayloadAction<DialogName>) => {
      const name = action.payload;
      state[name] = false;
    },
  },
});

export default dialogs;