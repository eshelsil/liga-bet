import React from 'react'
import { connect } from 'react-redux'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
} from '../types'
import { ContestantSelector } from '../_selectors'
import ExpandedContestantView from './ExpandedContestantView'
import { Dictionary } from 'lodash'

interface Props {
    matchBetsByUserId: Dictionary<MatchBetWithRelations[]>
    groupStandingBetsByUserId: Dictionary<GroupRankBetWithRelations[]>
    questionBetsByUserId: Dictionary<QuestionBetWithRelations[]>
    liveGameBetsByUtlId: Dictionary<MatchBetWithRelations[]>
    utlId: number
    isLive?: boolean
}

export function ExpandedContestantProvider({
    utlId,
    isLive,
    matchBetsByUserId,
    groupStandingBetsByUserId,
    questionBetsByUserId,
    liveGameBetsByUtlId,
}: Props) {
    const matchBets = matchBetsByUserId[utlId] ?? []
    const liveGameBets = liveGameBetsByUtlId[utlId] ?? []
    const questionBets = questionBetsByUserId[utlId] ?? []
    const groupStandingsBets =
        groupStandingBetsByUserId[utlId] ?? []
    
    return (
        <ExpandedContestantView
            utlId={utlId}
            isLive={isLive}
            matchBets={matchBets}
            liveGameBets={liveGameBets}
            questionBets={questionBets}
            groupStandingsBets={groupStandingsBets}
        />
    )
}

export default connect(ContestantSelector)(ExpandedContestantProvider)
