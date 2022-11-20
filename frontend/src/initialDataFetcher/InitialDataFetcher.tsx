import React from 'react'
import { useContestants, useFetchNotifications, useGameGoals, useGames, useGroups, useLeaderboard, useMyGameBets, usePlayers, usePrimalBets, useSpecialQuestions, useTeams } from '../hooks/useFetcher'
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
    useLeaderboard()
    usePrimalBets()
    useMyGameBets()
    useFetchNotifications()
    useCurrentTournamentNotificationsUpdater()

    return (
        children
    )
}

export default InitialDataFetcher
