import { createSelector } from 'reselect'
import { CurrentUser } from './base';


export const AuthControllerSelector = createSelector(
    CurrentUser,
    currentUser => ({ user: currentUser })
);