import React from 'react';
import { connect } from 'react-redux';
import { OpenGroupRankBetsSelector } from '../_selectors';
import OpenGroupRankBetsView from './OpenGroupRankBetsView';
import { BetTypes } from '../_enums/betTypes';
import { sendBetAndStore } from '../_actions/bets.ts';


const OpenGroupRankBetsProvider = ({
    groupsWithBet,
    sendBetAndStore,
}) => {
    async function sendGroupRankBet({
        groupId,
        standings,
    }) {
        const params = {
            betType: BetTypes.GroupsRank,
            type_id: groupId,
            value: standings.map(team => team.id),
        }

        await sendBetAndStore(params)
            .then(function (data) {
                toastr["success"]("ההימור נשלח");
            })
            .catch(function(error) {
                console.log("FAILED sending bet", error)
                toastr["error"](error.responseJSON.message);
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