import React, { useEffect } from 'react';
import MatchesView from './matchesView';
import { connect } from 'react-redux';
import { fetch_users } from '../_actions/users';
import { fetch_matches } from '../_actions/matches';
import { fetch_bets } from '../_actions/bets';
import { ClosedMatchBetsSelector } from '../_selectors/matchBets';





const ClosedMatchBets = ({
    done_matches,
    live_matches,
    fetch_users,
    fetch_bets,
    fetch_matches,
}) => {
    useEffect(()=>{
		fetch_users();
        fetch_bets();
        fetch_matches();
	}, []);
    return <MatchesView
        done_matches={done_matches}
        live_matches={live_matches}
    />
};

const mapDispatchToProps = {
    fetch_users,
    fetch_bets,
    fetch_matches,
}

export default connect(ClosedMatchBetsSelector, mapDispatchToProps)(ClosedMatchBets);