import React from 'react';
import MatchesView from './matchesView';
import { connect } from 'react-redux';
import { ClosedMatchBetsSelector } from '../_selectors/closedMatchBets.ts';


const ClosedMatchBets = ({
    done_matches,
    live_matches,
}) => {
    return <MatchesView
        done_matches={done_matches}
        live_matches={live_matches}
    />
};

export default connect(ClosedMatchBetsSelector)(ClosedMatchBets);