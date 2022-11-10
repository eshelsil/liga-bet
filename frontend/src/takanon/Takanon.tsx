import React from 'react';
import { useSelector } from 'react-redux';
import { PrizesSelector } from '../_selectors';
import Disclaimer from './Disclaimer';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import './TakanonStyle'


function Takanon() {
    const prizes = useSelector(PrizesSelector);
    

    return (
        <div className="LB-Takanon">
            <h2 style={{ textAlign: 'center' }}>תקנון משחק - ליגה ב' מונדיאל 2022</h2>

            <Disclaimer />
            <SendingBetsExplanation />
            <ScoresRules />
            <PrizesRules prizes={prizes} />
            <br/>

            <GeneralRules />
            <br/>
        </div>
    )
}

export default Takanon
