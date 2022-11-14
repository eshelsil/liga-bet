import React from 'react'
import { ScoreboardRow, UtlWithTournament } from '../types'
import UtlCard from './UtlCard'
import './MyUTLs.scss'

interface Props {
    utls: UtlWithTournament[]
    currentUtlId: number
    myScores: Record<number, ScoreboardRow>
    updateUTL: (id: number, params: { name: string }) => Promise<void>
    selectUtl: (id: number) => void
}

function MyUTLs({ utls, currentUtlId, updateUTL, selectUtl, myScores }: Props) {

    return (
        <div className="LigaBet-UTLPage">
            <h1 className="title LB-TitleText">הטורנירים שלי</h1>
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
    )
}

export default MyUTLs
