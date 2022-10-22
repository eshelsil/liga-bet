import React from 'react'
import { useContestants, useGames, useGroups, useLeaderboard, useMyGameBets, usePlayers, usePrimalBets, useSpecialQuestions, useTeams } from '../hooks/useFetcher'

export function InitialDataFetcher({
    children,
}) {
    useTeams()
    useGames()
    useGroups()
    usePlayers()
    useContestants()
    useSpecialQuestions()
    useLeaderboard()
    usePrimalBets()
    useMyGameBets()

    return children
}

export default InitialDataFetcher
