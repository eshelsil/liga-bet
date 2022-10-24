import { Tournament } from './tournament';
import { UtlBase } from './utl';


export interface TournamentWithLinkedUtl extends Tournament {
    linkedUtl: UtlBase,
}
