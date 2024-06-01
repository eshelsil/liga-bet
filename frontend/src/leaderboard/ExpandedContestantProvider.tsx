import React from 'react'
import { connect } from 'react-redux'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    SpecialQuestionAnswer,
    Team,
} from '../types'
import { ContestantSelector, IsWhatifOn } from '../_selectors'
import ExpandedContestantView from './ExpandedContestantView'
import { Dictionary } from 'lodash'
import { useSelector } from 'react-redux'

interface Props {
    matchBetsByUserId: Dictionary<MatchBetWithRelations[]>
    groupStandingBetsByUserId: Dictionary<GroupRankBetWithRelations[]>
    questionBetsByUserId: Dictionary<QuestionBetWithRelations[]>
    liveGameBetsByUtlId: Dictionary<MatchBetWithRelations[]>
    liveGroupRankBetsByUtlId: Dictionary<GroupRankBetWithRelations[]>
    liveStandingsByGroupId: Record<number, Team[]>
    liveQuestionBetsByUtlId: Dictionary<QuestionBetWithRelations[]>
    liveSpecialAnswers: Record<number, SpecialQuestionAnswer[]>
    whatifGameBetsByUtlId: Dictionary<MatchBetWithRelations[]>
    whatifQuestionBetsByUtlId: Dictionary<QuestionBetWithRelations[]>
    whatifSpecialAnswers: Record<number, SpecialQuestionAnswer[]>
    utlId: number
    isSideTournament: boolean
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
    whatifGameBetsByUtlId,
    whatifQuestionBetsByUtlId,
    whatifSpecialAnswers,
    isSideTournament,
}: Props) {
    const isWhatifOn = useSelector(IsWhatifOn)
    const matchBets = matchBetsByUserId[utlId] ?? []
    const liveGameBets = isWhatifOn ? (whatifGameBetsByUtlId[utlId] ?? []) : (liveGameBetsByUtlId[utlId] ?? [])
    const questionBets = questionBetsByUserId[utlId] ?? []
    const groupStandingsBets =
        groupStandingBetsByUserId[utlId] ?? []
    const liveGroupRankBets = liveGroupRankBetsByUtlId[utlId] ?? []
    const liveQuestionBets = isWhatifOn ? (whatifQuestionBetsByUtlId[utlId]) : (liveQuestionBetsByUtlId[utlId] ?? [])
    
    return (
        <ExpandedContestantView
            utlId={utlId}
            isLive={isLive || isWhatifOn}
            matchBets={matchBets}
            liveGameBets={liveGameBets}
            liveGroupRankBets={liveGroupRankBets}
            liveStandingsByGroupId={liveStandingsByGroupId}
            questionBets={questionBets}
            groupStandingsBets={groupStandingsBets}
            liveQuestionBets={liveQuestionBets}
            liveSpecialAnswers={isWhatifOn ? whatifSpecialAnswers : liveSpecialAnswers}
            isSideTournament={isSideTournament}
        />
    )
}

export default connect(ContestantSelector)(ExpandedContestantProvider)
