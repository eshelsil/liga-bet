import React from 'react'
import MatchesView from './MatchesView'
import { connect } from 'react-redux'
import { ClosedMatchBetsSelector, MatchWithBets } from '../_selectors'

interface Props {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
}

const ClosedMatchBets = ({
    done_matches,
    live_matches,
}: Props) => {

    return (
        <MatchesView done_matches={done_matches} live_matches={live_matches} />
    )
}

export default connect(
    ClosedMatchBetsSelector,
)(ClosedMatchBets)
