import React from 'react'
import { useCompetitions, useContestants, useFetchNotifications, useGameGoals, useGames, useGroups, useLeaderboardVersions, useMyGameBets, useNihusGrants, usePlayers, usePrimalBets, useSpecialQuestions, useTeams } from '../hooks/useFetcher'

function InitialDataFetcher({
    children,
}) {
    useTeams()
    useGames()
    useGameGoals()
    useGroups()
    usePlayers()
    useContestants()
    useSpecialQuestions()
    useLeaderboardVersions()
    usePrimalBets()
    useMyGameBets()
    useFetchNotifications()
    useCompetitions()
    useNihusGrants()


    return (
        children
    )
}

export default InitialDataFetcher
