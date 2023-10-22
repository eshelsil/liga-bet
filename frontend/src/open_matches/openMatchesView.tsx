import React from 'react'
import dayjs from 'dayjs'
import { MatchWithABet } from '../types'
import MatchBetView from './MatchBetView'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import MatchBetRules from '../takanon/matches/MatchBetRulesProvider'
import { MyOtherBettableUTLs } from '../_selectors'
import { useSelector } from 'react-redux'
import MultiBetsSettings from '../multiBetsSettings/MultiBetsSettingsProvider'
import { groupBy } from 'lodash'
import { getGameDayString } from '../utils'
import './MatchBets.scss'



interface Props {
    matches: MatchWithABet[]
    sendBet: (...args: any) => Promise<any>
}

const OpenMatchesView = ({ matches = [], sendBet }: Props) => {
    const hasMatches = matches.length > 0
    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    const gamesByGameDay: Record<string, MatchWithABet[]> = groupBy(matches, g => getGameDayString(g))
    return (
        <div className={'LB-OpenMatchesView'}>
            <h1 className='LB-TitleText'>ניחוש משחקים</h1>
            <div className='LB-FloatingFrame'>
                <ul style={{margin: 0}}>
                    <li>ניחוש כל משחק יהיה פתוח לעריכה עד לשעת תחילת המשחק</li>
                    <li style={{marginTop: 8}}>
                        ניתן לראות את שיטת הניקוד
                        <TakanonPreviewModal label={'בלחיצה כאן'}>
                            <MatchBetRules />
                        </TakanonPreviewModal>
                    </li>
                </ul>
            </div>
            <span className="admin">
                {dayjs().format('HH:mm  YYYY/MM/DD')}
            </span>
            {!hasMatches && <h3 className='LB-TitleText'>אין משחקים פתוחים</h3>}
            {hasMatches && (<>
                {hasOtherTournaments && (
                    <MultiBetsSettings />
                )}
                <div className='gamesContainer'>
                    {Object.entries(gamesByGameDay).map(
                        ([gameDay, games]) => {
                            const date = new Date(`${gameDay}T00:00:00`)
                            return (
                                <div key={gameDay} className='gameDay'>
                                    <h3 className='LB-TitleText dayTitle'>
                                        {date.toLocaleDateString('he-IL', {weekday: 'long'})} {date.toLocaleDateString('he-IL')}
                                    </h3>
                                    <div className='gamesSection'>
                                        {games.map((game) => (
                                            <MatchBetView
                                                key={game.id}
                                                match={game}
                                                sendBet={sendBet}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </>)}
        </div>
    )
}

export default OpenMatchesView
