import React, { useState } from 'react'
import TeamWithFlag from '../widgets/TeamWithFlag'
import { GroupWithABet, Team } from '../types'
import DraggableStandings from './DraggableStandings'
import './openGroupRankBets.scss'

interface Props {
    groupWithBet: GroupWithABet
    sendGroupRankBet: (...args: any) => Promise<void>
}

function GroupRankBetView({ groupWithBet, sendGroupRankBet }: Props) {
    const { name, id, bet, teams } = groupWithBet
    const [standingsInput, setStandingsInput] = useState<Team[]>(null)
    const teamsByRank = bet?.standings || teams
    const groupStandings = standingsInput || teamsByRank

    const sendBet = () => {
        sendGroupRankBet({ groupId: id, standings: groupStandings })
    }
    return (
        <div
            className="GroupRankBetView col-xs-12 col-md-9 col-lg-7"
            style={{
                float: 'right',
                borderRadius: 5,
                border: '#000 1px solid',
                marginBottom: 25,
                padding: 10,
            }}
        >
            <h5 style={{ textAlign: 'center' }}>{name}</h5>
            <div className="row">
                <div id={`current-bet-${id}-position`} className="col-xs-4">
                    {bet && (
                        <>
                            <h6>הימור נוכחי:</h6>
                            <ol
                                className="currentBet"
                                style={{ paddingRight: 10 }}
                            >
                                {bet.standings.map((team, index) => (
                                    <li
                                        key={index}
                                        style={{ fontSize: '80%' }}
                                        data-pos={index + 1}
                                    >
                                        <TeamWithFlag
                                            name={team.name}
                                            crest_url={team.crest_url}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                    {!bet && <h6>לא קיים הימור נוכחי</h6>}
                </div>
                <div
                    id={`set-bet-table-${id}`}
                    className={`${bet ? 'col-xs-8' : 'col-xs-12'}`}
                >
                    <DraggableStandings
                        items={groupStandings}
                        setItems={setStandingsInput}
                    />
                    <div style={{ paddingRight: 40, marginTop: 16 }}>
                        <button
                            onClick={sendBet}
                            type="button"
                            className="btn btn-primary"
                        >
                            שלח
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupRankBetView
