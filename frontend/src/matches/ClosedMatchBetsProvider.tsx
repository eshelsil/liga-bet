import React from 'react'
import MatchesView from './MatchesView'
import { connect } from 'react-redux'
import { ClosedMatchBetsSelector, GamesWithGoalsDataSelector, LiveGamesWithGoalsDataSelector } from '../_selectors'
import { orderBy } from 'lodash'
import { useSelector } from 'react-redux'
import { MatchWithBets } from '../types'

interface Props {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
}

const ClosedMatchBets = ({
    done_matches,
    live_matches,
}: Props) => {
    const doneMatchesSorted = orderBy(done_matches, 'start_time', 'desc')
    const doneGamesWithGoalsData = useSelector(GamesWithGoalsDataSelector)
    const liveGamesWithGoalsData = useSelector(LiveGamesWithGoalsDataSelector)
    const doneMatchesWithAllData = doneMatchesSorted.map(game => ({...game, scorers: doneGamesWithGoalsData[game.id]?.scorers ?? []}))
    const liveMatchesWithAllData = live_matches.map(game => ({...game, scorers: liveGamesWithGoalsData[game.id]?.scorers ?? []}))
    

    return (
        <MatchesView done_matches={doneMatchesWithAllData} live_matches={liveMatchesWithAllData} />
    )
}

export default connect(
    ClosedMatchBetsSelector,
)(ClosedMatchBets)
