import React from 'react'
import dayjs from 'dayjs'
import { MatchWithABet } from '../types'
import MatchBetView from './MatchBetView'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import MatchBetRules from '../takanon/matches/MatchBetRulesProvider'
import './MatchBets.scss'
import { MyOtherBettableUTLs } from '../_selectors'
import { useSelector } from 'react-redux'
import MultiBetsSettings from '../multiBetsSettings/MultiBetsSettingsProvider'

interface Props {
    matches: MatchWithABet[]
    sendBet: (...args: any) => Promise<any>
}

const OpenMatchesView = ({ matches = [], sendBet }: Props) => {
    const hasMatches = matches.length > 0
    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    return (
        <div className={'LB-OpenMatchesView'}>
            <h1 className='LB-TitleText'>ניחוש משחקים</h1>
            <ul className='LB-FloatingFrame'>
                <li>ניחוש כל משחק יהיה פתוח לעריכה עד לשעת תחילת המשחק</li>
                <li style={{marginTop: 8}}>
                    ניתן לראות את שיטת הניקוד
                    <TakanonPreviewModal label={'בלחיצה כאן'}>
                        <MatchBetRules />
                    </TakanonPreviewModal>
                </li>
            </ul>
            <span className="admin">
                {dayjs().format('HH:mm  YYYY/MM/DD')}
            </span>
            {!hasMatches && <h3>אין משחקים פתוחים</h3>}
            {hasMatches && (<>
                {hasOtherTournaments && (
                    <MultiBetsSettings />
                )}
                <div className='gamesContainer'>
                    {matches.map((match) => (
                        <MatchBetView
                            key={match.id}
                            match={match}
                            sendBet={sendBet}
                        />
                    ))}
                </div>
            </>)}
        </div>
    )
}

export default OpenMatchesView
