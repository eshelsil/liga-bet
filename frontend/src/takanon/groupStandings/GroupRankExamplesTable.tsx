import React from 'react'
import { GroupRankBetScoreConfig, GroupWithTeams, Team } from '../../types'
import CustomTable from '../../widgets/Table/CustomTable'
import GroupStandingsResult from '../../widgets/GroupStandings'



interface ExampleModel {
    id: string,
    group: string,
    bet: Team[],
    result: Team[],
    score: number,
}


interface Props {
    scoreConfig: GroupRankBetScoreConfig
    exampleGroup: GroupWithTeams
}

const GroupRankExamplesTable = ({
    scoreConfig: {
        perfect,
        minorMistake,
    },
    exampleGroup,
}: Props) => {
    const teamA = exampleGroup.teams[0]
    const teamB = exampleGroup.teams[1]
    const teamC = exampleGroup.teams[2]
    const teamD = exampleGroup.teams[3]

    const models: ExampleModel[] = [
        {
            id: 'perfect',
            group: exampleGroup.name,
            bet: [
                teamA,
                teamB,
                teamC,
                teamD,
            ],
            result: [
                teamA,
                teamB,
                teamC,
                teamD,
            ],
            score: perfect,
        },
        {
            id: 'minorMistake',
            group: exampleGroup.name,
            bet: [
                teamA,
                teamB,
                teamC,
                teamD,
            ],
            result: [
                teamA,
                teamC,
                teamB,
                teamD,
            ],
            score: minorMistake,
        },
        {
            id: 'miss1',
            group: exampleGroup.name,
            bet: [
                teamA,
                teamB,
                teamC,
                teamD,
            ],
            result: [
                teamC,
                teamA,
                teamB,
                teamD,
            ],
            score: 0,
        },
        {
            id: 'miss2',
            group: exampleGroup.name,
            bet: [
                teamA,
                teamB,
                teamC,
                teamD,
            ],
            result: [
                teamB,
                teamA,
                teamD,
                teamC,
            ],
            score: 0,
        },
    ]

    const cells = [
		{
			id: 'bet',
			header: 'הניחוש שלך',
            classes: {
                cell: 'alignToTop'
            },
			getter: (model: ExampleModel) => (
                <GroupStandingsResult
                    standings={model.bet}
                    name={model.group}
                />
            ),
		},
		{
			id: 'result',
			header: 'תוצאה בפועל',
			getter: (model: ExampleModel) => (
                <GroupStandingsResult
                    standings={model.result}
                    name={model.group}
                />
            ),
		},
		{
			id: 'score',
			header: 'נק\'',
            classes: {
                cell: 'scoreCell'
            },
			getter: (model: ExampleModel) => model.score,
		},
    ]
    return (
        <div className='LB-GroupRankExamplesTable'>
            <CustomTable models={models} cells={cells} />
        </div>
    )
}

export default GroupRankExamplesTable
