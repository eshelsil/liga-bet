import React from 'react'
import { useHistory } from 'react-router-dom'

function useGoTo() {
    const history = useHistory()

    const goToUserPage = () => history.push('/user')
    const goToUtlPage = () => history.push('/utls')
    const goToMyBets = () => history.push('/my-bets')
    const goToJoinTournament = () => history.push('/join-tournament')
    const goToCreateTournament = () => history.push('/create-tournament')
    const goToLeaderboard = () => history.push('/leaderboard')
    const goToOpenGameBets = () => history.push('/open-matches')
    const goToTournamentConfig = () => history.push('/tournament-config')
    const goToInviteFriends = () => history.push('/invite-friends')
    const goToHome = () => history.push('/')

    return {
        goToUserPage,
        goToUtlPage,
        goToMyBets,
        goToJoinTournament,
        goToCreateTournament,
        goToHome,
        goToLeaderboard,
        goToOpenGameBets,
        goToTournamentConfig,
        goToInviteFriends,
    }
}

export default useGoTo
