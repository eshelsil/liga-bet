import React from 'react';
import '../styles/global.scss';
import SpecialBetsTable from "./specialBetsTable";
import MatchesBetsTable from "./matchesBetsTable";
import GroupPositionBetsTable from "./groupPositionBetsTable";


const MyBetsView = (props) => {

    return (
        <div className="my-bets-container">
            <h1>הטופס שלי</h1>
            <SpecialBetsTable/>
            <MatchesBetsTable/>
            <GroupPositionBetsTable/>
        </div>
    );
};

export default MyBetsView;