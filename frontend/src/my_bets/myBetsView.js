import React, { useEffect } from 'react';
import '../styles/global.scss';
import SpecialBetsTable from "./specialBetsTable";
import MatchesBetsTable from "./matchesBetsTable";
import GroupPositionBetsTable from "./groupPositionBetsTable";
import { MyBetsSelector } from '../_selectors/userBets';
import { connect } from 'react-redux';
import { fetch_bets } from '../_actions/bets';
import { BetTypes } from '../_enums/betTypes';


const MyBetsView = ({
    betsByType = {},
    fetch_bets,
}) => {
    const matchBets = betsByType[BetTypes.Match] ?? [];
    const stangingBets = betsByType[BetTypes.GroupsRank] ?? [];
    const questionBets = betsByType[BetTypes.SpecialBet] ?? [];
    useEffect(()=>{
		fetch_bets();
	}, [])
    return (
        <div className="my-bets-container">
            <h1>הטופס שלי</h1>
            <SpecialBetsTable bets={questionBets}/>
            <MatchesBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={stangingBets} />
        </div>
    );
};

const mapDispatchToProps = {
    fetch_bets,
}

export default connect(MyBetsSelector, mapDispatchToProps)(MyBetsView);