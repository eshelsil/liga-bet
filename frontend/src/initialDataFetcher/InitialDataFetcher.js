import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAndStoreBets } from '../_actions/bets.ts';
import { fetchAndStoreGroups } from '../_actions/groups';
import { fetchAndStoreMatches } from '../_actions/matches';
import { fetchAndStoreQuestions } from '../_actions/specialQuestions.ts';
import { fetchAndStoreTeams } from '../_actions/teams.ts';
import { fetchAndStoreUsers } from '../_actions/users';
import { NoSelector } from '../_selectors';


export function InitialDataFetcher({
    children,
    fetchAndStoreMatches,
    fetchAndStoreBets,
    fetchAndStoreTeams,
    fetchAndStoreGroups,
    fetchAndStoreQuestions,
    fetchAndStoreUsers,
}) {
    useEffect(()=> {
        fetchAndStoreTeams();
        fetchAndStoreGroups();
        fetchAndStoreMatches();
        fetchAndStoreQuestions();
        fetchAndStoreUsers();
        fetchAndStoreBets();
    }, []);
    return (
        children
    );
}

const mapDispatchToProps = {
    fetchAndStoreMatches,
    fetchAndStoreBets,
    fetchAndStoreTeams,
    fetchAndStoreGroups,
    fetchAndStoreQuestions,
    fetchAndStoreUsers,
}

export default connect(NoSelector, mapDispatchToProps)(InitialDataFetcher);