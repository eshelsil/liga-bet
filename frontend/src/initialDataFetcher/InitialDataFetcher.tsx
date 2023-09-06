import React from 'react'
import { useCompetitions, useContestants, useFetchNotifications, useGameGoals, useGames, useGroups, useLeaderboardVersions, useMyGameBets, usePlayers, usePrimalBets, useSpecialQuestions, useTeams } from '../hooks/useFetcher'
import { useCurrentTournamentNotificationsUpdater } from '../hooks/useUpdater'

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
    useCurrentTournamentNotificationsUpdater()
    useCompetitions()

    return (
        children
    )
}

export default InitialDataFetcher
