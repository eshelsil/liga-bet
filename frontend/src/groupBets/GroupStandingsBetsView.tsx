import React from 'react'
import { GroupRankBetWithRelations, GroupWithTeams } from '../types'
import GroupRankGumblersList from './GroupRankGumblersList'
import './GroupStandingsBetsView.scss'


interface Props {
    groups: GroupWithTeams[]
    betsByGroupId: Record<number, GroupRankBetWithRelations[]>
}

const GroupStandingsBetsView = ({ groups, betsByGroupId }: Props) => {
    return (
        <div className='LB-GroupStandingsBetsView'>
            <h2 className='LB-TitleText'>ניחושים על דירוגי בתים</h2>
            <div>
                {groups.map((group) => (
                    <GroupRankGumblersList
                        key={group.id}
                        group={group}
                        bets={betsByGroupId[group.id]}
                    />
                ))}
            </div>
        </div>
    )
}

export default GroupStandingsBetsView
