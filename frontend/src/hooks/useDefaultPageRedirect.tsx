import React from 'react'
import { useSelector } from 'react-redux'
import { TournamentStatus, UtlRole } from '../types'
import { CurrentTournamentUser, HasAnyUTL, PrizesSelector } from '../_selectors'
import useGoTo from './useGoTo'

function useDefaultPageRedirect(): () => void {
    const { 
        goToUserPage,
        goToLeaderboard,
        goToOpenGameBets,
        goToTournamentConfig,
    } = useGoTo()
    const currentUtl = useSelector(CurrentTournamentUser)
    const hasAnyUtl = useSelector(HasAnyUTL)
    const prizes = useSelector(PrizesSelector);

    const isTournamentOwner = currentUtl?.role === UtlRole.Admin
    const hasPrizes = prizes.length > 0
    const tournamentStatus = currentUtl.tournament.status

    if (!hasAnyUtl) {
        return goToUserPage
    }
    if ([TournamentStatus.Finished, TournamentStatus.Ongoing].includes(tournamentStatus)) {
        return goToLeaderboard
    }
    if (tournamentStatus === TournamentStatus.OpenForBets) {
        if (isTournamentOwner && !hasPrizes){
            return goToTournamentConfig
        }
        return goToOpenGameBets
    }
    if (isTournamentOwner){
        return goToTournamentConfig
    }
    return goToUserPage
}

export default useDefaultPageRedirect
