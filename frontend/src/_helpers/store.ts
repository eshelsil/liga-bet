import { configureStore } from '@reduxjs/toolkit'
import rootReducer  from '../_reducers/root';

const store = configureStore({ reducer: rootReducer })

export type GetRootState = typeof store.getState
export type RootState = ReturnType<GetRootState>
export type AppDispatch = typeof store.dispatch


export default store;