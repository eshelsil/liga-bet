import React from 'react'
import { ScoreboardRow, UtlWithTournament } from '../types'
import UtlCard from './UtlCard'
import CompetitionTile from './CompetitionTile'


interface Props {
    utls: UtlWithTournament[]
    currentUtlId: number
    myScores: Record<number, ScoreboardRow>
    updateUTL: (id: number, params: { name: string }) => Promise<void>
    selectUtl: (id: number) => void
}

function MyUtlsOfCompetition({ utls, currentUtlId, myScores, updateUTL, selectUtl } : Props){
    
    return (<>
        {utls.length > 0 && (
            <div className='LB-MyUtlsOfCompetition'>
                <CompetitionTile competition={utls[0].tournament.competition} />
                
                <div className="utlsCollection">
                    {utls.map((utl, index) => (
                        <UtlCard
                            key={utl.id}
                            utl={utl}
                            utlIndex={index}
                            isSelected={utl.id === currentUtlId}
                            selectUtl={() => selectUtl(utl.id)}
                            updateUTL={(params) => updateUTL(utl.tournament.id, params)}
                            socreboardRow={myScores[utl.tournament.id]}
                        />
                    ))}
                </div>
            </div>
        )}
    </>)
}

export default MyUtlsOfCompetition


