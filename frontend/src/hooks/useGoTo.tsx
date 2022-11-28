import React from 'react'
import { useHistory } from 'react-router-dom'
import { ClosedBetsTab } from '../closedBets'

function useGoTo() {
    const history = useHistory()

    const goToMyProfile = () => history.push('/profile')
    const goToMyBets = () => history.push('/my-bets')
    const goToHisBets = (id: number) => history.push(`/his-bets/${id}`)
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

    const goToClosedBets = (tab: ClosedBetsTab) => history.push(`/closed-bets/${tab}`)
    const goToClosedGameBets = () => goToClosedBets(ClosedBetsTab.Games)
    const goToClosedGroupRankBets = () => goToClosedBets(ClosedBetsTab.Questions)
    const goToClosedQuestionBets = () => goToClosedBets(ClosedBetsTab.Groups)


    return {
        goToMyProfile,
        goToMyBets,
        goToHisBets,
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
        goToClosedBets,
        goToClosedGameBets,
        goToClosedGroupRankBets,
        goToClosedQuestionBets,
    }
}

export default useGoTo
