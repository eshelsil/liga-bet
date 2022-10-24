import React from 'react'
import { useHistory } from 'react-router-dom'

function useGoTo() {
    const history = useHistory()

    const goToUserPage = () => history.push('/user')
    const goToUtlPage = () => history.push('/utl')
    const goToMyBets = () => history.push('/my-bets')
    const goToJoinTournament = () => history.push('/join-tournament')
    const goToCreateTournament = () => history.push('/create-tournament')
    const goToHome = () => history.push('/')

    return {
        goToUserPage,
        goToUtlPage,
        goToMyBets,
        goToJoinTournament,
        goToCreateTournament,
        goToHome,
    }
}

export default useGoTo
