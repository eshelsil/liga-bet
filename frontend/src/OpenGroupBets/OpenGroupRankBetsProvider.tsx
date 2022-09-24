import React from 'react';
import { connect } from 'react-redux';
import { OpenGroupRankBetsSelector } from '../_selectors/groupStandingBets';
import OpenGroupRankBetsView from './OpenGroupRankBetsView';
import { sendBetAndStore } from '../_actions/bets';
import { GroupWithABet, BetType } from '../types';


interface Props {
    groupsWithBet: GroupWithABet[],
    sendBetAndStore: any,
}

const OpenGroupRankBetsProvider = ({
    groupsWithBet,
    sendBetAndStore,
}: Props) => {
    async function sendGroupRankBet({
        groupId,
        standings,
    }) {
        const params = {
            betType: BetType.GroupsRank,
            type_id: groupId,
            value: standings.map(team => team.id),
        }

        await sendBetAndStore(params)
            .then(function (data) {
                window['toastr']["success"]("ההימור נשלח");
            })
            .catch(function(error) {
                console.log("FAILED sending bet", error)
                window['toastr']["error"](error.responseJSON.message);
            });
    }
    
    return <OpenGroupRankBetsView
        groupsWithBet={groupsWithBet}
        sendGroupRankBet={sendGroupRankBet}
    />
};

const mapDispatchToProps = {
    sendBetAndStore,
}

export default connect(OpenGroupRankBetsSelector, mapDispatchToProps)(OpenGroupRankBetsProvider);