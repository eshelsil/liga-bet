import { groupBy, orderBy, pickBy, some, without } from 'lodash';
import { createSelector } from 'reselect'
import { isAdmin, isTournamentLive, keysOf, valuesOf } from '../../utils';
import { Contestants, CurrentTournament, CurrentTournamentUserId, CurrentUser, MyUtls, OpenCompetitions, OwnedTournaments, TournamentIdSelector } from '../base';


export const MyUtlsOfCurrentCompetition = createSelector(
    MyUtls,
    CurrentTournament,
    (myUtlsById, tournament) => {
        return pickBy(myUtlsById, utl => utl.tournament.competitionId === tournament.competitionId)
    }
)

export const MyUtlsOfCurrentCompSorted = createSelector(
    MyUtlsOfCurrentCompetition,
    (myUtlsById) => {
        return orderBy(valuesOf(myUtlsById), utl => utl.createdAt)
    }
)



export const ChosenTournamentIndex = createSelector(
    MyUtlsOfCurrentCompSorted,
    CurrentTournamentUserId,
    (utlsByDate, currentUtlId) => {
        const chosenUtlIndex = utlsByDate.findIndex(utl => utl.id === currentUtlId);
        return chosenUtlIndex;
    }
)

export const MyUtlsByCompetitionId = createSelector(
    MyUtls,
    (utlsById) => {
        return groupBy(valuesOf(utlsById), utl => utl.tournament.competitionId)
    }
)

export const LiveUTLsByCompetitionId = createSelector(
    MyUtlsByCompetitionId,
    (utlsBycompId) => {
        return pickBy(utlsBycompId, utls => isTournamentLive(utls[0].tournament))
    }
)

export const OldUTLsByCompetitionId = createSelector(
    MyUtlsByCompetitionId,
    (utlsBycompId) => {
        return pickBy(utlsBycompId, utls => !isTournamentLive(utls[0].tournament))
    }
)

export const CanJoinAnotherTournament = createSelector(
    MyUtls,
    OpenCompetitions,
    CurrentUser,
    (myUtlsById, openCompetitions, currentUser) => {
        let allowedUtlsPerCompetition = 3
        if (isAdmin(currentUser)){
            allowedUtlsPerCompetition = 5;
        }
        const utlsPerCompetition = groupBy(myUtlsById, utl => utl.tournament.competitionId)
        return some(keysOf(openCompetitions),
            compId => (utlsPerCompetition[compId] ?? []).length < allowedUtlsPerCompetition
        )

    }
)

export const CanCreateNewTournament = createSelector(
    OwnedTournaments,
    OpenCompetitions,
    CurrentUser,
    (ownedTournaments, openCompetitions, currentUser) => {
        const ownedTournamentsPerCompetition = groupBy(ownedTournaments, t => t.competitionId)
        const openCompetitionWithoutTournamentExists = some(keysOf(openCompetitions),
            cId => (ownedTournamentsPerCompetition[cId] ?? []).length === 0
        )
        if (isAdmin(currentUser)){
            return true;
        }
        // if (currentUser.permissions === UserPermissions.TournamentAdmin){
        //     return !hasOwnedTournament;
        // }
        // return false;
        return openCompetitionWithoutTournamentExists;
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

export const MyOtherTournaments = createSelector(
    MyUtlsOfCurrentCompetition,
    TournamentIdSelector,
    (utls, tournamentId) => {
        return without(valuesOf(utls).map(utl => utl.tournament.id), tournamentId)
    }
)