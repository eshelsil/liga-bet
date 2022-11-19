import React from 'react'
import { LeaderboardVersion, LeaderboardVersionById } from '../types'
import LeaderboardVersionInput from './LeaderboardVersionInput';
import { pickBy } from 'lodash';


export interface HistoryFormState {
    to: LeaderboardVersion
    from?: LeaderboardVersion
}


interface Props {
    state: HistoryFormState
    setState: (params: HistoryFormState) => void
    versionsById: LeaderboardVersionById
}

function LeaderboardHistoryForm({ versionsById, state, setState }: Props) {
    const {to: targetVersion, from: pastVersion} = state

    const onTargetVersionChange = (id: number) => {
        const selectedVersion = versionsById[id]
        if (!selectedVersion) return
        const params = {
            ...state,
            to: selectedVersion
        }
        if (selectedVersion.order < pastVersion?.order){
            params.from = null
        }
        setState(params)
    }

    const onPastVersionChange = (id: number) => {
        const selectedVersion = versionsById[id]
        if (!selectedVersion || selectedVersion.order > targetVersion.order){
            setState({
                ...state,
                from: null
            })
            return
        }
        setState({
            ...state,
            from: selectedVersion
        })
    }

    const pastVersionsById = pickBy(versionsById, v => v.order <= targetVersion.order)
    const pastVersionId = pastVersionsById[pastVersion?.id]?.id ?? null


    return (
        <div className={`LB-LeaderboardHistoryForm LB-FloatingFrame`}>
            <div className='LeaderboardHistoryForm-title'>
                מצב טבלה היסטורי
            </div>
            <div className='LeaderboardHistoryForm-inputsWrapper'>
                <LeaderboardVersionInput
                    versionsById={versionsById}
                    value={targetVersion.id}
                    onChange={onTargetVersionChange}
                    label='שלב סופי'
                />
                <LeaderboardVersionInput
                    versionsById={pastVersionsById}
                    value={pastVersionId}
                    onChange={onPastVersionChange}
                    label='שלב התחלתי'
                />
            </div>
        </div>
    )
}

export default LeaderboardHistoryForm
