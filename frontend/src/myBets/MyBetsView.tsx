import React from 'react';
import '../styles/global.scss';
import SpecialBetsTable from "./SpecialBetsTable";
import MatchesBetsTable from "./MatchesBetsTable";
import GroupPositionBetsTable from "./GroupPositionBetsTable";
import { MyBetsSelector } from '../_selectors';
import { useSelector } from 'react-redux';


const MyBetsView = () => {
    const {
        matchBets,
        groupRankBets,
        questionBets,
    } = useSelector(MyBetsSelector)
    return (
        <div className="my-bets-container">
            <h1>הטופס שלי</h1>
            <SpecialBetsTable bets={questionBets}/>
            <MatchesBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={groupRankBets} />
        </div>
    );
};

export default MyBetsView;