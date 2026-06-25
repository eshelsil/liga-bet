import React from 'react'
import { useSelector } from 'react-redux'
import { TournamentStatus, UtlRole } from '../types'
import { AnsweredUseDefaultScoreDialog, CurrentTournamentUser, IsCurrentTournamentKnockoutBracket } from '../_selectors'
import useGoTo from './useGoTo'

function useDefaultPageRedirect(): () => void {
    const { 
        goToMyProfile,
        goToLeaderboard,
        goToTournamentConfig,
        goToOpenGameBets,
    } = useGoTo()
    const currentUtl = useSelector(CurrentTournamentUser)
    const hasSelectedUtl = !!currentUtl
    const answeredDefaultScoreDialog = useSelector(AnsweredUseDefaultScoreDialog);
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)

    const isTournamentOwner = currentUtl?.role === UtlRole.Admin
    const tournamentStatus = currentUtl.tournament.status

    if (!hasSelectedUtl) {
        return goToMyProfile
    }
    if ([TournamentStatus.Finished, TournamentStatus.Ongoing].includes(tournamentStatus)) {
        return goToLeaderboard
    }
    if (tournamentStatus === TournamentStatus.Initial) {
        if (isTournamentOwner && !answeredDefaultScoreDialog){
            return goToTournamentConfig
        }
        if (isKnockoutBracket) {
            return goToOpenGameBets
        }
        return goToLeaderboard
    }
    return goToMyProfile
}

export default useDefaultPageRedirect
