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
    utlId: number
}

export function ExpandedContestantProvider({
    utlId,
    matchBetsByUserId,
    groupStandingBetsByUserId,
    questionBetsByUserId,
}: Props) {
    const matchBets = matchBetsByUserId[utlId] ?? []
    const questionBets = questionBetsByUserId[utlId] ?? []
    const groupStandingsBets =
        groupStandingBetsByUserId[utlId] ?? []

    return (
        <ExpandedContestantView
            utlId={utlId}
            matchBets={matchBets}
            questionBets={questionBets}
            groupStandingsBets={groupStandingsBets}
        />
    )
}

export default connect(ContestantSelector)(ExpandedContestantProvider)
