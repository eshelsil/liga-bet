import React, { useState } from 'react'
import { sumBetsScore } from './utils'
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
} from '../types'
import SimpleTabs from '../widgets/Tabs/Tabs'
import SpecialBetsTable from '../myBets/SpecialBetsTable'
import GameBetsTable from '../myBets/GameBetsTable'
import GroupRankBetsTable from '../myBets/GroupRankBetsTable'
import useGoTo from '../hooks/useGoTo'
import { Link } from '@mui/material'
import { useGameBetsOfUtl } from '../hooks/useFetcher'


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
    questionBets: QuestionBetWithRelations[]
    isLive?: boolean
}

export function ExpandedContestantView({
    utlId,
    matchBets,
    liveGameBets,
    groupStandingsBets,
    questionBets,
    isLive,
}: Props) {
    const { goToHisBets } = useGoTo()
    const [selectedTab, setSelectedTab] = useState(0)
    const matchesScore = sumBetsScore(matchBets)
    const groupStandingsScore = sumBetsScore(groupStandingsBets)
    const specialBetScore = sumBetsScore(questionBets)

    const gameBetsToShow = isLive ? [...liveGameBets, ...matchBets] : matchBets

    
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
                    <SpecialBetsTable bets={questionBets} />
                </div>
            )
        },
        {
            id: 'groups',
            label: 'דירוגי בתים',
            children: (
                <div>
                    <h3>סה"כ:{' '}{groupStandingsScore}</h3>
                    <GroupRankBetsTable bets={groupStandingsBets} />
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
