import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SpecialQuestionsById } from '../types';


const specialQuestions = createSlice({
  name: 'specialQuestions',
  initialState: {} as SpecialQuestionsById,
  reducers: {
    set: (state, action: PayloadAction<SpecialQuestionsById>) => action.payload,
  },
});

export default specialQuestions;