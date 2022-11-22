import React from 'react'
import MatchesView from './MatchesView'
import { connect } from 'react-redux'
import { ClosedMatchBetsSelector, MatchWithBets } from '../_selectors'
import { orderBy } from 'lodash'

interface Props {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
}

const ClosedMatchBets = ({
    done_matches,
    live_matches,
}: Props) => {
    const doneMotchesSorted = orderBy(done_matches, 'start_time', 'desc')

    return (
        <MatchesView done_matches={doneMotchesSorted} live_matches={live_matches} />
    )
}

export default connect(
    ClosedMatchBetsSelector,
)(ClosedMatchBets)
