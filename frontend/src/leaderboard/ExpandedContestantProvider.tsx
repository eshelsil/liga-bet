import React from 'react'
import { connect } from 'react-redux'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    SpecialQuestionAnswer,
    Team,
} from '../types'
import { ContestantSelector } from '../_selectors'
import ExpandedContestantView from './ExpandedContestantView'
import { Dictionary } from 'lodash'

interface Props {
    matchBetsByUserId: Dictionary<MatchBetWithRelations[]>
    groupStandingBetsByUserId: Dictionary<GroupRankBetWithRelations[]>
    questionBetsByUserId: Dictionary<QuestionBetWithRelations[]>
    liveGameBetsByUtlId: Dictionary<MatchBetWithRelations[]>
    liveGroupRankBetsByUtlId: Dictionary<GroupRankBetWithRelations[]>
    liveStandingsByGroupId: Record<number, Team[]>
    liveQuestionBetsByUtlId: Dictionary<QuestionBetWithRelations[]>
    liveSpecialAnswers: Record<number, SpecialQuestionAnswer[]>
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
    liveGroupRankBetsByUtlId,
    liveStandingsByGroupId,
    liveQuestionBetsByUtlId,
    liveSpecialAnswers,
}: Props) {
    const matchBets = matchBetsByUserId[utlId] ?? []
    const liveGameBets = liveGameBetsByUtlId[utlId] ?? []
    const questionBets = questionBetsByUserId[utlId] ?? []
    const groupStandingsBets =
        groupStandingBetsByUserId[utlId] ?? []
    const liveGroupRankBets = liveGroupRankBetsByUtlId[utlId] ?? []
    const liveQuestionBets = liveQuestionBetsByUtlId[utlId] ?? []
    
    return (
        <ExpandedContestantView
            utlId={utlId}
            isLive={isLive}
            matchBets={matchBets}
            liveGameBets={liveGameBets}
            liveGroupRankBets={liveGroupRankBets}
            liveStandingsByGroupId={liveStandingsByGroupId}
            questionBets={questionBets}
            groupStandingsBets={groupStandingsBets}
            liveQuestionBets={liveQuestionBets}
            liveSpecialAnswers={liveSpecialAnswers}
        />
    )
}

export default connect(ContestantSelector)(ExpandedContestantProvider)
