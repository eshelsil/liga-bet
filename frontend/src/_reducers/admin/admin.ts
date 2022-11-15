import { combineReducers } from 'redux'
import allTournaments from './allTournaments'

const adminReducer = combineReducers({
    allTournaments: allTournaments.reducer,
})

export default adminReducer
