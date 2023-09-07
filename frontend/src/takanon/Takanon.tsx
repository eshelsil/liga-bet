import React from 'react';
import { useSelector } from 'react-redux';
import { CurrentTournament, PrizesSelector } from '../_selectors';
import Disclaimer from './Disclaimer';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import './TakanonStyle'


function Takanon() {
    const prizes = useSelector(PrizesSelector);
    const tournament = useSelector(CurrentTournament)
    

    return (
        <div className="LB-Takanon">
            <h2 className='LB-TitleText' style={{ textAlign: 'center' }}>תקנון משחק - ליגה ב' {tournament?.competition?.name ?? ''}</h2>

            <div className='LB-FloatingFrame'>
                <Disclaimer />
            </div>
            <SendingBetsExplanation />
            <ScoresRules />
            <PrizesRules prizes={prizes} />
            <br/>

            <div className='LB-FloatingFrame'>
                <GeneralRules />
            </div>
            <br/>
        </div>
    )
}

export default Takanon
