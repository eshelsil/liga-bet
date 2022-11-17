import React from 'react'
import { useSelector } from 'react-redux'
import { Contestants, GroupStandingBetsByUserId, MatchBetsByUserId, QuestionBetsByUserQuestionId } from '../_selectors'
import MySpecialBetsTable from './MySpecialBetsTable'
import MyGameBetsTable from './MyGameBetsTable'
import GroupPositionBetsTable from './MyGroupPositionBetsTable'
import { useParams } from 'react-router-dom'
import { useGameBetsOfUtl } from '../hooks/useFetcher'
import { GameBetsFetchType } from '../types'
import './MyBetsView.scss'


function HisBetsView() {
    const { utlId: utlIdString } = useParams<{utlId: string}>()
    const utlId = Number(utlIdString)
    useGameBetsOfUtl(utlId)

    const matchBetsByUtlId = useSelector(MatchBetsByUserId)
    const groupRankBetsByUtlId = useSelector(GroupStandingBetsByUserId)
    const questionBetsByUtlId = useSelector(QuestionBetsByUserQuestionId)
    const utlsById = useSelector(Contestants)

    const matchBets = matchBetsByUtlId[utlId] ?? []
    const groupRankBets = groupRankBetsByUtlId[utlId] ?? []
    const questionBets = questionBetsByUtlId[utlId] ?? []

    const utl = utlsById[utlId]

    return (
        <div className="LB-MyBetsView">
            <h1 className='LB-TitleText'>הטופס של {utl?.name}</h1>
            <MySpecialBetsTable bets={questionBets} />
            <MyGameBetsTable bets={matchBets} />
            <GroupPositionBetsTable bets={groupRankBets} />
        </div>
    )
}

export default HisBetsView
