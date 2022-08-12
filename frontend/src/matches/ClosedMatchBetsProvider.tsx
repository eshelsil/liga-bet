import React, { useEffect } from 'react';
import MatchesView from './matchesView';
import { connect } from 'react-redux';
import { ClosedMatchBetsSelector } from '../_selectors/closedMatchBets';
import { BetFetchType, fetchAndStoreBets } from '../_actions/bets';


const ClosedMatchBets = ({
    done_matches,
    live_matches,
    fetchAndStoreBets,
}) => {

    useEffect(()=>{
        fetchAndStoreBets(BetFetchType.GameBets);
    }, [])
    return <MatchesView
        done_matches={done_matches}
        live_matches={live_matches}
    />
};

const mapDispatchToProps = {
    fetchAndStoreBets,
}

export default connect(ClosedMatchBetsSelector, mapDispatchToProps)(ClosedMatchBets);