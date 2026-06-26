import React, { useState } from 'react'
import { ScoreboardRow, UtlWithTournament } from '../types'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { isTournamentLive, keysOf, valuesOf } from '../utils'
import { Button, Collapse } from '@mui/material'

import './MyUTLs.scss'
import { groupBy, orderBy, pickBy } from 'lodash';
import MyUtlsOfCompetition from './MyUtlsOfCompetition';
import { useTranslation } from 'react-i18next'

interface Props {
    utls: UtlWithTournament[]
    currentUtlId: number
    myScores: Record<number, ScoreboardRow>
    updateUTL: (id: number, params: { name: string }) => Promise<void>
    selectUtl: (id: number) => void
}

function MyUTLs({ utls, currentUtlId, updateUTL, selectUtl, myScores }: Props) {

    const { t } = useTranslation('myUTLs')
    const [showHistory, setShowHistory] = useState(false)
    const toggleShowHistory = () => setShowHistory(!showHistory)


    const utlsPerCompetition = groupBy(utls, utl => utl.tournament.competitionId)
    const liveUtlsPerCompetition = pickBy(utlsPerCompetition, utls => isTournamentLive(utls[0].tournament))
    const oldUtlsPerCompetition = pickBy(utlsPerCompetition, utls => !isTournamentLive(utls[0].tournament))

    const hasHistory = keysOf(oldUtlsPerCompetition).length > 0
    return (
        <div className="LigaBet-UTLPage">
            <div>
                <h1 className="title LB-TitleText">{t('titles.myTournaments')}</h1>
                {orderBy(valuesOf(liveUtlsPerCompetition), us => us[0].tournament.competition.startTime, 'desc').map(competitionUtls => (
                    <MyUtlsOfCompetition key={competitionUtls[0].tournament.competitionId} {...{ utls: competitionUtls, currentUtlId, updateUTL, selectUtl, myScores }}/>
                ))}
            </div>
            {hasHistory && (<>
                <Button className="UTLPage-showOld" variant='contained' color='primary' onClick={toggleShowHistory}>
                    {showHistory ? t('buttons.hidePastTournaments') : t('buttons.showPastTournaments')}
                    <ArrowDownIcon className={`UTLPage-showOldArrowDown ${showHistory ? 'showOldArrowDown-expanded' : ''}`} />
                </Button>
                <Collapse in={showHistory}>
                    <div>
                        <h1 className="title LB-TitleText">{t('titles.pastTournaments')}</h1>
                        {orderBy(valuesOf(oldUtlsPerCompetition), us => us[0].tournament.competition.startTime, 'desc').map(competitionUtls => (
                            <MyUtlsOfCompetition key={competitionUtls[0].tournament.competitionId} {...{ utls: competitionUtls, currentUtlId, updateUTL, selectUtl, myScores }}/>
                        ))}
                    </div>
                </Collapse>
            </>)}
        </div>
    )
}

export default MyUTLs
