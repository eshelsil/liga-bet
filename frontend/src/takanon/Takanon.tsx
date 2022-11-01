import React from 'react';
import { useSelector } from 'react-redux';
import { generateDefaultScoresConfig } from '../tournamentConfig/utils';
import { PrizesSelector, ScoresConfigSelector } from '../_selectors';
import Disclaimer from './Disclaimer';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import { isEmpty } from 'lodash';
import './style.scss';


function Takanon() {
    const prizes = useSelector(PrizesSelector);
    const existingScoreConfig = useSelector(ScoresConfigSelector);
    const scoreConfig = isEmpty(existingScoreConfig)
        ? generateDefaultScoresConfig()
        : existingScoreConfig

    return (
        <div className="all-ltr" style={{ marginBottom: 30 }}>
            <h2 style={{ textAlign: 'center' }}>תקנון משחק - ליגה ב' מונדיאל 2022</h2>

            <Disclaimer />
            <SendingBetsExplanation />
            <ScoresRules config={scoreConfig} />
            <PrizesRules prizes={prizes} />
            <br/>

            <GeneralRules />
            <br/>
        </div>
    )
}

export default Takanon
