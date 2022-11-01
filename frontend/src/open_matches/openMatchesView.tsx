import moment from 'moment'
import React from 'react'
import { MatchWithABet } from '../types'
import MatchBetView from './MatchBetView'
import './MatchBets.scss'

interface Props {
    matches: MatchWithABet[]
    sendBet: (...args: any) => Promise<any>
}

const OpenMatchesView = ({ matches = [], sendBet }: Props) => {
    const hasMatches = matches.length > 0
    return (
        <div className={'LB-OpenMatchesView'}>
            <h1>רשימת משחקים</h1>
            <span className="admin">
                {moment().format('HH:mm  YYYY/MM/DD')}
            </span>
            {!hasMatches && <h3>אין משחקים פתוחים</h3>}
            {hasMatches && (
                <div className='gamesContainer'>
                    {matches.map((match) => (
                        <MatchBetView
                            key={match.id}
                            match={match}
                            sendBet={sendBet}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default OpenMatchesView
