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




interface Props {
    utlId: number
    matchBets: MatchBetWithRelations[]
    groupStandingsBets: GroupRankBetWithRelations[]
    questionBets: QuestionBetWithRelations[]
}

export function ExpandedContestantView({
    utlId,
    matchBets,
    groupStandingsBets,
    questionBets,
}: Props) {
    const [selectedTab, setSelectedTab] = useState(0)
    const matchesScore = sumBetsScore(matchBets)
    const groupStandingsScore = sumBetsScore(groupStandingsBets)
    const specialBetScore = sumBetsScore(questionBets)

    
    const tabs = [
        {
            id: 'games',
            label: 'משחקים',
            children: (
                <div>
                    <h3>סה"כ:{' '}{matchesScore}</h3>
                    <GameBetsTable bets={matchBets} dropColumns={{date: true}} />
                </div>
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
            <SimpleTabs
                tabs={tabs}
                index={selectedTab}
                onChange={setSelectedTab}
            />
        </div>
    )
}

export default ExpandedContestantView
