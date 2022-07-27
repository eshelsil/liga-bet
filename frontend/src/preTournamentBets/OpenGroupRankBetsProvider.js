import React from 'react';
import { connect } from 'react-redux';
import { OpenGroupRankBetsSelector } from '../_selectors';
import OpenGroupRankBetsView from './OpenGroupRankBetsView';
import { BetTypes } from '../_enums/betTypes';
import { send_bet } from '../_actions/bets';


const OpenGroupRankBetsProvider = ({
    groupsWithBet,
    send_bet,
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

        await send_bet(params)
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
    send_bet,
}

export default connect(OpenGroupRankBetsSelector, mapDispatchToProps)(OpenGroupRankBetsProvider);