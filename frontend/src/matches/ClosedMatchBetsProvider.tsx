import React, { useEffect } from 'react'
import MatchesView from './MatchesView'
import { connect } from 'react-redux'
import { ClosedMatchBetsSelector, MatchWithBets } from '../_selectors'
import { BetFetchType, fetchAndStoreBets } from '../_actions/bets'

interface Props {
    done_matches: MatchWithBets[]
    live_matches: MatchWithBets[]
    fetchAndStoreBets: (type: BetFetchType) => void
}

const ClosedMatchBets = ({
    done_matches,
    live_matches,
    fetchAndStoreBets,
}: Props) => {
    // useEffect(()=>{
    //     fetchAndStoreBets(BetFetchType.GameBets);
    // }, [])
    return (
        <MatchesView done_matches={done_matches} live_matches={live_matches} />
    )
}

const mapDispatchToProps = {
    fetchAndStoreBets,
}

export default connect(
    ClosedMatchBetsSelector,
    mapDispatchToProps
)(ClosedMatchBets)
