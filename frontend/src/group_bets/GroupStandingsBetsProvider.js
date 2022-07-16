import React, { useEffect } from 'react';
import GroupStandingsBetsView from './GroupStandingsBetsView';
import { connect } from 'react-redux';
import { AllGroupStandingsBets } from '../_selectors/standingBets';
import { fetch_users } from '../_actions/users';
import { fetch_groups } from '../_actions/groups';
import { fetch_bets } from '../_actions/bets';





const GroupStandingsBets = ({
    groups,
    betsByGroupId,
    fetch_users,
    fetch_bets,
    fetch_groups,
}) => {
    useEffect(()=>{
		fetch_users();
        fetch_bets();
        fetch_groups();
	}, []);
    return <GroupStandingsBetsView
        groups={Object.values(groups)}
        betsByGroupId={betsByGroupId}
    />
};

const mapDispatchToProps = {
    fetch_users,
    fetch_bets,
    fetch_groups,
}

export default connect(AllGroupStandingsBets, mapDispatchToProps)(GroupStandingsBets);