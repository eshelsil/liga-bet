import { useCompetitions, useContestants, useFetchNotifications, useGameGoals, useGames, useGroups, useLeaderboardVersions, useMyGameBets, useNihusGrants, useNihusim, usePlayers, usePrimalBets, useSpecialQuestions, useTeams } from '../hooks/useFetcher'

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
    useNihusim()

    return (
        children
    )
}

export default InitialDataFetcher
