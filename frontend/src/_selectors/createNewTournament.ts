import { createSelector } from 'reselect'
import { Competitions, MyUtls, OwnedTournament } from './base';


const OwningTournamentWithNoUtl = createSelector(
    OwnedTournament,
    MyUtls,
    (ownedTournament, myUtls ) => {
        const ownedTournamentId = ownedTournament.id;
        if (!ownedTournamentId){
            return false;
        }
        for (const utl of Object.values(myUtls)){
            if (utl.tournament.id === ownedTournamentId){
                return false;
            }
        }
        return true;
    }
);
export const CreateNewTournamentSelector = createSelector(
    OwnedTournament,
    Competitions,
    OwningTournamentWithNoUtl,
    (ownedTournament, competitionsById, isMissingUtl ) => {
        const tournamentWithNoUtl = isMissingUtl ? ownedTournament : undefined;
        return {
            competitionsById,
            tournamentWithNoUtl,
        };
    }
);