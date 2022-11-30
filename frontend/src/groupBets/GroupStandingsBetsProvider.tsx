import React from 'react'
import GroupStandingsBetsView from './GroupStandingsBetsView'
import { useSelector } from 'react-redux'
import { AllGroupStandingsBets } from '../_selectors/groupStandingBets'

const GroupStandingsBets = () => {
    const { groups, betsByGroupId, liveBetsByGroupId } = useSelector(AllGroupStandingsBets)

    return (
        <GroupStandingsBetsView
            groups={groups}
            betsByGroupId={betsByGroupId}
            liveBetsByGroupId={liveBetsByGroupId}
        />
    )
}

export default GroupStandingsBets
