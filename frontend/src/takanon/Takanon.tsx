import React from 'react';
import { useSelector } from 'react-redux';
import { CurrentTournament } from '../_selectors';
import Disclaimer from './Disclaimer';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import './style.scss';


function Takanon() {
    const tournament = useSelector(CurrentTournament);

    return (
        <div className="all-ltr" style={{ marginBottom: 30 }}>
            <h2 style={{ textAlign: 'center' }}>תקנון משחק יורו חברים 2021</h2>

            <Disclaimer />
            <SendingBetsExplanation />
            <ScoresRules config={tournament.config} />
            <PrizesRules prizes={tournament.config.prizes} />
            <br/>

            <GeneralRules />
            <br/>
        </div>
    )
}

export default Takanon
