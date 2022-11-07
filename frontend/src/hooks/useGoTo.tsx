import React from 'react'
import { useHistory } from 'react-router-dom'

function useGoTo() {
    const history = useHistory()

    const goToMyProfile = () => history.push('/profile')
    const goToMyBets = () => history.push('/my-bets')
    const goToJoinTournament = () => history.push('/join-tournament')
    const goToCreateTournament = () => history.push('/create-tournament')
    const goToLeaderboard = () => history.push('/leaderboard')
    const goToOpenGameBets = () => history.push('/open-matches')
    const goToOpenQuestionBets = () => history.push('/open-questions')
    const goToTournamentConfig = () => history.push('/tournament-config')
    const goToScoresConfig = () => history.push('/tournament-scores-config')
    const goToInviteFriends = () => history.push('/invite-friends')
    const goToTakanon = () => history.push('/takanon')
    const goToHome = () => history.push('/')
    const goToAdminIndex = () => history.push('/admin')
    const goToAdminInviteTournamentAdmin = () => history.push('/admin/invite-tournament-admin')

    return {
        goToMyProfile,
        goToMyBets,
        goToJoinTournament,
        goToCreateTournament,
        goToHome,
        goToLeaderboard,
        goToOpenGameBets,
        goToOpenQuestionBets,
        goToTournamentConfig,
        goToScoresConfig,
        goToInviteFriends,
        goToTakanon,
        goToAdminIndex,
        goToAdminInviteTournamentAdmin,
    }
}

export default useGoTo
