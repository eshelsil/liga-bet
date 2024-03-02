import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../_reducers/root'
import { useDispatch } from 'react-redux'

const store = configureStore({ reducer: rootReducer })

export type GetRootState = typeof store.getState
export type RootState = ReturnType<GetRootState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
