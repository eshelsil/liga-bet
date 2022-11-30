import React from 'react'
import { GroupRankBetWithRelations, GroupWithTeams } from '../types'
import GroupRankGumblersList from './GroupRankGumblersList'
import './GroupStandingsBetsView.scss'


interface Props {
    groups: GroupWithTeams[]
    betsByGroupId: Record<number, GroupRankBetWithRelations[]>
    liveBetsByGroupId: Record<number, GroupRankBetWithRelations[]>
}

const GroupStandingsBetsView = ({ groups, betsByGroupId, liveBetsByGroupId, }: Props) => {
    return (
        <div className='LB-GroupStandingsBetsView'>
            <h2 className='LB-TitleText'>ניחושים על דירוגי בתים</h2>
            <div>
                {groups.map((group) => {
                    const isLive = !!liveBetsByGroupId[group.id]
                    return (
                        <GroupRankGumblersList
                            key={group.id}
                            group={group}
                            isLive={isLive}
                            bets={isLive ? liveBetsByGroupId[group.id] : betsByGroupId[group.id]}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default GroupStandingsBetsView
