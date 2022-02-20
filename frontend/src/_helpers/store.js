import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer  from '../_reducers/root';

export default createStore(
    rootReducer,
    applyMiddleware(thunk)
);