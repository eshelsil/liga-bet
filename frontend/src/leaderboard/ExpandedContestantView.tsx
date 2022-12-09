import React, { useState } from 'react'
import { sumBetsScore } from './utils'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    Team,
} from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import SpecialBetsTable from '../myBets/SpecialBetsTable'
import GameBetsTable from '../myBets/GameBetsTable'
import GroupRankBetsTable from '../myBets/GroupRankBetsTable'
import useGoTo from '../hooks/useGoTo'
import { Link } from '@mui/material'
import { useGameBetsOfUtl } from '../hooks/useFetcher'
import { keyBy, map } from 'lodash'
import { keysOf } from '../utils'


function GameBetsView({totalScore, bets, utlId, showLive}: {
    bets: MatchBetWithRelations[],
    totalScore: number,
    utlId: number,
    showLive?: boolean,
}) {
    useGameBetsOfUtl(utlId)

    return (
        <div>
            <h3>סה"כ:{' '}{totalScore}</h3>
            <GameBetsTable bets={bets} dropColumns={{date: true}} showLive={showLive} />
        </div>
    )
}

interface Props {
    utlId: number
    matchBets: MatchBetWithRelations[]
    liveGameBets: MatchBetWithRelations[]
    groupStandingsBets: GroupRankBetWithRelations[]
    liveGroupRankBets: GroupRankBetWithRelations[]
    questionBets: QuestionBetWithRelations[]
    liveQuestionBets: QuestionBetWithRelations[]
    liveStandingsByGroupId: Record<number, Team[]>
    isLive?: boolean
}

export function ExpandedContestantView({
    utlId,
    matchBets,
    liveGameBets,
    groupStandingsBets,
    liveGroupRankBets,
    questionBets,
    liveStandingsByGroupId,
    liveQuestionBets,
    isLive,
}: Props) {
    const { goToHisBets } = useGoTo()
    const [selectedTab, setSelectedTab] = useState(0)
    
    const liveGroupRankBetsById = keyBy(liveGroupRankBets, 'id')
    const liveQuestionBetsById = keyBy(liveQuestionBets, 'id')
    const gameBetsToShow = isLive ? [...liveGameBets, ...matchBets] : matchBets
    const groupRankBetsToShow = isLive
        ? groupStandingsBets.map(
            bet => ({
                ...bet,
                score: liveGroupRankBetsById[bet.id]?.score ?? bet.score
            })
        )
        : groupStandingsBets
    const questionBetsToShow = isLive
        ? questionBets.map(
            bet => ({
                ...bet,
                score: !!liveQuestionBetsById[bet.id] ? liveQuestionBetsById[bet.id].score : bet.score,
            })
        )
        : questionBets

    const matchesScore = sumBetsScore(gameBetsToShow)
    const groupStandingsScore = sumBetsScore(groupRankBetsToShow)
    const specialBetScore = sumBetsScore(questionBetsToShow)

    
    const tabs = [
        {
            id: 'games',
            label: 'משחקים',
            children: (
                <GameBetsView
                    bets={gameBetsToShow}
                    totalScore={matchesScore}
                    utlId={utlId}
                    showLive={isLive}
                />
            )
        },
        {
            id: 'questions',
            label: 'ניחושים מיוחדים',
            children: (
                <div>
                    <h3>סה"כ:{' '}{specialBetScore}</h3>
                    <SpecialBetsTable
                        bets={questionBetsToShow}
                        showLive={isLive}
                        liveBetIds={map(keysOf(liveQuestionBetsById), id => Number(id))}
                    />
                </div>
            )
        },
        {
            id: 'groups',
            label: 'דירוגי בתים',
            children: (
                <div>
                    <h3>סה"כ:{' '}{groupStandingsScore}</h3>
                    <GroupRankBetsTable
                        bets={groupRankBetsToShow}
                        liveStandings={liveStandingsByGroupId}
                        showLive={isLive}
                    />
                </div>
            )
        },
        
    ]


    return (
        <div className='LB-ExpanededContestantView'>
            <div className='hisBetsLink'>
                <Link onClick={() => goToHisBets(utlId)}>
                    לצפייה בטופס המלא
                </Link>
            </div>
            <SimpleTabs
                tabs={tabs}
                index={selectedTab}
                onChange={setSelectedTab}
            />
        </div>
    )
}

export default ExpandedContestantView
