import React from 'react';
import { useSelector } from 'react-redux';
import { CurrentTournament, GroupStageGamesCount, GroupsWithTeams } from '../_selectors';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import './style.scss';


function Takanon() {
    const tournament = useSelector(CurrentTournament);
    const groupsById = useSelector(GroupsWithTeams);
    const groupStageGamesCount = useSelector(GroupStageGamesCount);
    const knockoutGamesCount = 16;


    const groups = Object.values(groupsById);
    const exampleGroup = groups[0];
    const groupsCount = groups.length;

    return (
        <div className="all-ltr" style={{marginBottom: 30}}>
            <h2 style={{textAlign: 'center'}}>תקנון משחק יורו חברים 2021</h2>

            <SendingBetsExplanation />
            <ScoresRules {...{
                tournament,
                groupStageGamesCount,
                knockoutGamesCount,
                exampleGroup,
                groupsCount,
            }} />

            <PrizesRules prizes={tournament.config.prizes} />            
            <br/>

            <GeneralRules />            
            <br/>
        </div>
    );
};

export default Takanon;