import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { NihusWithRelationsById } from '../../types'
import { isGameLive, valuesOf } from '../../utils'
import { Contestants, CurrentTournamentUserId, MatchBets, Nihusim } from '../base'
import { MatchesWithTeams } from './matches'


export const NihusimWithRelations = createSelector(
    Nihusim,
    MatchesWithTeams,
    Contestants,
    MatchBets,
    (nihusimById, gamesById, utlsById, matchBetsById): NihusWithRelationsById => {
        return pickBy(
            mapValues(nihusimById, nihus => ({
                ...nihus,
                targetedUtl: utlsById[nihus.target_utl_id],
                senderUtl: utlsById[nihus.sender_utl_id],
                game: gamesById[nihus.game_id],
                bet: valuesOf(matchBetsById).find(bet => bet.user_tournament_id === nihus.target_utl_id),
            })),
            n => !!n.targetedUtl && !!n.senderUtl && !!n.game && !!n.bet
        );
    }
)


export const MyActiveNihus = createSelector(
    NihusimWithRelations,
    CurrentTournamentUserId,
    (nihusimById, utlId) => {
        return valuesOf(nihusimById).find(nihus => nihus.target_utl_id === utlId && !nihus.seen && isGameLive(nihus.game) );
    }
)

export const MySentNihusim = createSelector(
    NihusimWithRelations,
    CurrentTournamentUserId,
    (nihusimById, utlId) => {
        return pickBy(nihusimById, nihus => nihus.sender_utl_id === utlId );
    }
)