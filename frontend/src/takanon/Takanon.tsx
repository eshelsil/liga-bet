import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CurrentTournament, IsCurrentTournamentKnockoutBracket, IsOnAutoBet, PrizesSelector } from '../_selectors';
import AutoBetExplanation from './AutoBetExplanation';
import BracketBettingRules from './bracket/BracketBettingRules';
import BracketScoresRules from './bracket/BracketScoresRules';
import Disclaimer from './Disclaimer';
import GeneralRules from './GeneralRules';
import PrizesRules from './PrizesRules';
import ScoresRules from './ScoresRules';
import SendingBetsExplanation from './SendingBetsExplanation';
import './TakanonStyle'


function Takanon() {
    const { t } = useTranslation('takanon');
    const prizes = useSelector(PrizesSelector);
    const tournament = useSelector(CurrentTournament)
    const isAutoBetOn = useSelector(IsOnAutoBet)
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)


    return (
        <div className="LB-Takanon">
            <h2 className='LB-TitleText' style={{ textAlign: 'center' }}>{t('title', { competition: tournament?.competition?.name ?? '' })}</h2>

            <div className='LB-FloatingFrame'>
                <Disclaimer />
            </div>
            {isKnockoutBracket ? (<>
                <h3 className='LB-TitleText' style={{marginBottom: 20}}>{t('scores.heading')}</h3>
                <BracketBettingRules />
                <BracketScoresRules />
            </>) : (<>
                <SendingBetsExplanation />
                {isAutoBetOn && <AutoBetExplanation />}
                <ScoresRules />
            </>)}
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
