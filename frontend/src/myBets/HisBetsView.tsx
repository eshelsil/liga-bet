import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Contestants, GroupStandingBetsByUserId, MatchBetsByUserId, QuestionBetsByUserQuestionId } from '../_selectors'
import MySpecialBetsTable from './MySpecialBetsTable'
import MyGameBetsTable from './MyGameBetsTable'
import KnockoutGameBetsTable from './KnockoutGameBetsTable'
import GroupPositionBetsTable from './MyGroupPositionBetsTable'
import { useParams } from 'react-router-dom'
import { useGameBetsOfUtl } from '../hooks/useFetcher'
import { GameBetsFetchType } from '../types'
import { IsCurrentTournamentKnockoutBracket } from '@/_selectors'
import './MyBetsView.scss'

function HisBetsView() {
    const { t } = useTranslation('myBets')
    const { utlId: utlIdString } = useParams<{utlId: string}>()
    const utlId = Number(utlIdString)
    useGameBetsOfUtl(utlId)

    const matchBetsByUtlId = useSelector(MatchBetsByUserId)
    const groupRankBetsByUtlId = useSelector(GroupStandingBetsByUserId)
    const questionBetsByUtlId = useSelector(QuestionBetsByUserQuestionId)
    const utlsById = useSelector(Contestants)
    const isKnockoutBracket = useSelector(IsCurrentTournamentKnockoutBracket)

    const matchBets = matchBetsByUtlId[utlId] ?? []
    const groupRankBets = groupRankBetsByUtlId[utlId] ?? []
    const questionBets = questionBetsByUtlId[utlId] ?? []

    const utl = utlsById[utlId]

    return (
        <div className="LB-MyBetsView">
            <h1 className='LB-TitleText'>{t('titles.userForm', { name: utl?.name })}</h1>
            <MySpecialBetsTable bets={questionBets} />
            {isKnockoutBracket
                ? <KnockoutGameBetsTable utlId={utlId} bets={matchBets} />
                : <MyGameBetsTable bets={matchBets} />
            }
            {isKnockoutBracket ? null : (
                <GroupPositionBetsTable bets={groupRankBets} />
            )}
        </div>
    )
}

export default HisBetsView
