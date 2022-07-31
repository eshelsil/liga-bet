import React from 'react';
import '../styles/global.scss';
import SpecialBetsTable from "./specialBetsTable";
import MatchesBetsTable from "./matchesBetsTable";
import GroupPositionBetsTable from "./groupPositionBetsTable";
import { MyBetsSelector } from '../_selectors/myBets.ts';
import { connect } from 'react-redux';


const MyBetsView = ({
    matchBets,
    groupRankBets,
    questionBets,
}) => {

    return (
        <div className="my-bets-container">
            <h1>הטופס שלי</h1>
            <SpecialBetsTable bets={questionBets}/>
            <MatchesBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={groupRankBets} />
        </div>
    );
};

export default connect(MyBetsSelector)(MyBetsView);