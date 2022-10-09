import React, { useState } from 'react'
import TeamWithFlag from '../widgets/TeamWithFlag'
import { GroupWithABet } from '../types'
import DraggableStandings from './DraggableStandings'
import './openGroupRankBets.scss'

function GroupRankBetView({ groupWithBet, sendGroupRankBet }) {
    const { name, id, bet, teams } = groupWithBet
    const [standingsInput, setStandingsInput] = useState(null)
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

interface Props {
    groupsWithBet: GroupWithABet[]
    sendGroupRankBet: (...args: any) => Promise<void>
}

const OpenGroupRankBetsView = ({ groupsWithBet, sendGroupRankBet }: Props) => {
    const isAvaiable = true
    return (
        <>
            {isAvaiable && (
                <div
                    className="row"
                    style={{ marginRight: -10, marginLeft: -10 }}
                >
                    <h2>הימורי בתים פתוחים</h2>
                    {groupsWithBet.map((groupWithBet) => (
                        <GroupRankBetView
                            key={groupWithBet.id}
                            groupWithBet={groupWithBet}
                            sendGroupRankBet={sendGroupRankBet}
                        />
                    ))}
                </div>
            )}
            {!isAvaiable && (
                <h2>נסגרו הימורי הבתים! לא ניתן לעדכן הימורים אלה</h2>
            )}
        </>
    )
}

export default OpenGroupRankBetsView
