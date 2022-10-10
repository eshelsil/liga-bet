import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BetFetchType, fetchAndStoreBets } from '../_actions/bets'
import { fetchAndStoreGroups } from '../_actions/groups'
import { fetchAndStoreMatches } from '../_actions/matches'
import { fetchAndStoreQuestions } from '../_actions/specialQuestions'
import { fetchAndStorePlayers } from '../_actions/players'
import { fetchAndStoreTeams } from '../_actions/teams'
import { fetchAndStoreContestants } from '../_actions/contestants'
import { NoSelector } from '../_selectors/noSelector'

export function InitialDataFetcher({
    children,
    fetchAndStoreMatches,
    fetchAndStoreBets,
    fetchAndStoreTeams,
    fetchAndStoreGroups,
    fetchAndStoreQuestions,
    fetchAndStorePlayers,
    fetchAndStoreContestants,
}) {
    useEffect(() => {
        fetchAndStoreTeams()
        fetchAndStoreGroups()
        fetchAndStoreMatches()
        fetchAndStoreQuestions()
        fetchAndStorePlayers()
        fetchAndStoreContestants()
        fetchAndStoreBets(BetFetchType.MyBets)
        fetchAndStoreBets(BetFetchType.GameBets)
        fetchAndStoreBets(BetFetchType.PrimalBets)
    }, [])
    return children
}

const mapDispatchToProps = {
    fetchAndStoreMatches,
    fetchAndStoreBets,
    fetchAndStoreTeams,
    fetchAndStoreGroups,
    fetchAndStoreQuestions,
    fetchAndStorePlayers,
    fetchAndStoreContestants,
}

export default connect(NoSelector, mapDispatchToProps)(InitialDataFetcher)
