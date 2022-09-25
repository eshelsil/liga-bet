import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SpecialQuestionsApiModelById } from '../types';


const specialQuestions = createSlice({
  name: 'specialQuestions',
  initialState: {} as SpecialQuestionsApiModelById,
  reducers: {
    set: (state, action: PayloadAction<SpecialQuestionsApiModelById>) => action.payload,
  },
});

export default specialQuestions;