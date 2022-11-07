import React from 'react'
import { useSelector } from 'react-redux'
import { TournamentStatus, UtlRole } from '../types'
import { AnsweredUseDefaultScoreDialog, CurrentTournamentUser } from '../_selectors'
import useGoTo from './useGoTo'

function useDefaultPageRedirect(): () => void {
    const { 
        goToMyProfile,
        goToLeaderboard,
        goToOpenQuestionBets,
        goToTournamentConfig,
    } = useGoTo()
    const currentUtl = useSelector(CurrentTournamentUser)
    const hasSelectedUtl = !!currentUtl
    const answeredDefaultScoreDialog = useSelector(AnsweredUseDefaultScoreDialog);

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
        return goToOpenQuestionBets
    }
    return goToMyProfile
}

export default useDefaultPageRedirect
