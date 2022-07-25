import React from 'react';
import GroupStandingsBetsView from './GroupStandingsBetsView';
import { connect } from 'react-redux';
import { AllGroupStandingsBets } from '../_selectors/standingBets';


const GroupStandingsBets = ({
    groups,
    betsByGroupId,
}) => {

    return <GroupStandingsBetsView
        groups={Object.values(groups)}
        betsByGroupId={betsByGroupId}
    />
};


export default connect(AllGroupStandingsBets)(GroupStandingsBets);