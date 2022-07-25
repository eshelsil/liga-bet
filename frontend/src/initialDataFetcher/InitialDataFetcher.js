import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetch_bets } from '../_actions/bets';
import { fetch_groups } from '../_actions/groups';
import { fetch_matches } from '../_actions/matches';
import { fetch_questions } from '../_actions/specialQuestions';
import { fetch_teams } from '../_actions/teams';
import { fetch_users } from '../_actions/users';
import { NoSelector } from '../_selectors/main';


export function InitialDataFetcher({
    children,
    fetch_matches,
    fetch_bets,
    fetch_teams,
    fetch_groups,
    fetch_questions,
    fetch_users,
}) {
    useEffect(()=> {
        fetch_teams();
        fetch_groups();
        fetch_matches();
        fetch_questions();
        fetch_users();
        fetch_bets();
    }, []);
    return (
        children
    );
}

const mapDispatchToProps = {
    fetch_matches,
    fetch_bets,
    fetch_teams,
    fetch_groups,
    fetch_questions,
    fetch_users,
}

export default connect(NoSelector, mapDispatchToProps)(InitialDataFetcher);