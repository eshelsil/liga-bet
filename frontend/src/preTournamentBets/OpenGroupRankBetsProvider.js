import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { OpenGroupRankBetsSelector } from '../_selectors/standingBets';
import { fetch_groups } from '../_actions/groups';
import { fetch_matches } from '../_actions/matches';
import { fetch_bets, send_bet } from '../_actions/bets';
import OpenGroupRankBetsView from './OpenGroupRankBetsView';
import { BetTypes } from '../_enums/betTypes';



function getValueFromStandings(standings){
    const res = {};
    for (const [index, team] of Object.entries(standings)){
        res[1 + Number(index)] = team.id;
    }
    return res;
}

const OpenGroupRankBetsProvider = ({
    groupsWithBet,
    fetch_groups,
    fetch_bets,
    fetch_matches,
    send_bet,
}) => {
    useEffect(()=>{
		fetch_groups();
        fetch_bets();
        fetch_matches();
	}, []);
    async function sendGroupRankBet({
        groupId,
        standings,
    }) {
        const params = {
            betType: BetTypes.GroupsRank,
            type_id: groupId,
            value: getValueFromStandings(standings),
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
    fetch_groups,
    fetch_bets,
    send_bet,
    fetch_matches,
}

export default connect(OpenGroupRankBetsSelector, mapDispatchToProps)(OpenGroupRankBetsProvider);