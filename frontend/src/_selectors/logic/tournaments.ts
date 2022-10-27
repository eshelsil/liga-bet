import { sortBy } from 'lodash';
import { createSelector } from 'reselect'
import { UserPermissions } from '../../types';
import { isAdmin } from '../../utils';
import { Contestants, CurrentTournament, CurrentTournamentUserId, CurrentUser, MyUtls, OwnedTournament } from '../base';

export const ChosenTournamentIndex = createSelector(
    MyUtls,
    CurrentTournamentUserId,
    (myUtlsById, currentUtlId) => {
        const utlsByDate = sortBy(Object.values(myUtlsById), 'createdAt');
        const chosenUtlIndex = utlsByDate.findIndex(utl => utl.id === currentUtlId);
        return chosenUtlIndex;
    }
)

export const CanJoinAnotherTournament = createSelector(
    MyUtls,
    CurrentUser,
    (myUtlsById, currentUser) => {
        const tournamentsCount = Object.values(myUtlsById).length;
        if (isAdmin(currentUser)){
            return tournamentsCount < 5;
        }
        return tournamentsCount < 3;
    }
)

export const CanCreateNewTournament = createSelector(
    OwnedTournament,
    CurrentUser,
    (ownedTournament, currentUser) => {
        const hasOwnedTournament = !!ownedTournament.id;
        if (isAdmin(currentUser)){
            return true;
        }
        if (currentUser.permissions === UserPermissions.TournamentAdmin){
            return !hasOwnedTournament;
        }
        return false;
    }
)

export const CurrentTournamentOwner = createSelector(
    Contestants,
    CurrentTournament,
    (contestants, tournament) => {
        const creatorId = tournament.creatorUserId
        return Object.values(contestants).find(utl => utl.user_id === creatorId)
    }
)