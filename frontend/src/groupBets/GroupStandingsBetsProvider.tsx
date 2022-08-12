import React from 'react';
import GroupStandingsBetsView from './GroupStandingsBetsView';
import { useSelector } from 'react-redux';
import { AllGroupStandingsBets } from '../_selectors/groupStandingBets';


const GroupStandingsBets = () => {
    const { groups, betsByGroupId } = useSelector(AllGroupStandingsBets);

    return <GroupStandingsBetsView
        groups={groups}
        betsByGroupId={betsByGroupId}
    />
};


export default GroupStandingsBets;