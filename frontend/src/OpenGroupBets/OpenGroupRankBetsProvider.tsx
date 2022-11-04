import React from 'react'
import { connect } from 'react-redux'
import { OpenGroupRankBetsSelector } from '../_selectors/groupStandingBets'
import OpenGroupRankBetsView from './OpenGroupRankBetsView'
import { sendBetAndStore, SendGroupRankBetParams } from '../_actions/bets'
import { GroupWithABet, BetType, Team } from '../types'

interface Props {
    groupsWithBet: GroupWithABet[]
    sendBetAndStore: (params: SendGroupRankBetParams) => Promise<void>
}

const OpenGroupRankBetsProvider = ({
    groupsWithBet,
    sendBetAndStore,
}: Props) => {
    async function sendGroupRankBet({
        groupId,
        standings,
    }: {
        groupId: number
        standings: Team[]
    }) {
        const params = {
            betType: BetType.GroupsRank,
            type_id: groupId,
            payload: {
                value: standings.map((team) => team.id),
            },
        }
        return await sendBetAndStore(params)
    }

    return (
        <OpenGroupRankBetsView
            groupsWithBet={groupsWithBet}
            sendGroupRankBet={sendGroupRankBet}
        />
    )
}

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(
    OpenGroupRankBetsSelector,
    mapDispatchToProps
)(OpenGroupRankBetsProvider)
