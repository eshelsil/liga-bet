import moment from 'moment'
import React, { useState } from 'react'
import { MatchWithABet } from '../types'
import MatchBet from './MatchBet'

interface Props {
    matches: MatchWithABet[]
    sendBet: (...args: any) => Promise<any>
}

const OpenMatchesView = ({ matches = [], sendBet }: Props) => {
    const hasMatches = matches.length > 0
    return (
        <div>
            <h1>רשימת משחקים</h1>
            <span className="admin">
                {moment().format('HH:mm  YYYY/MM/DD')}
            </span>
            {!hasMatches && <h3>אין משחקים פתוחים</h3>}
            {hasMatches && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="admin">מזהה</th>
                            <th className="open-matches-date-header">תאריך</th>
                            <th>משחק</th>
                            <th
                                className="open-matches-bet-header"
                                style={{ paddingLeft: 30 }}
                            >
                                הימור
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match) => (
                            <MatchBet
                                key={match.id}
                                match={match}
                                sendBet={sendBet}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default OpenMatchesView
