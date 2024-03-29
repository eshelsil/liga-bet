import React from 'react'
import { QuestionBetWithRelations, SpecialQuestionAnswer, SpecialQuestion } from '../types'
import { keysOf } from '../utils'
import CustomTable from '../widgets/Table/CustomTable'
import { SpecialAnswer } from '../widgets/specialAnswer'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { groupBy, orderBy } from 'lodash'
import GumblersList from '../gumblersList/GumblersList'


interface BetInstance {
    id: number,
    answer: SpecialQuestionAnswer
    score: number,
    gumblers: {name: string, id: number}[],
}

interface Props {
    question: SpecialQuestion,
    bets: QuestionBetWithRelations[],
}

function QuestionBetGumblersList({ question, bets }: Props ) {
    const betsByAnswerId = groupBy(bets, (bet) => bet.answer.id)
    const tournamentClass = useTournamentThemeClass()
    const { type, name } = question

    const models = keysOf(betsByAnswerId).map((answerId: number): BetInstance => {
        const bets = betsByAnswerId[answerId]
        const betSample = bets[0]
        return {
            id: answerId,
            answer: betSample.answer,
            score: betSample.score,
            gumblers: bets.map((bet) => ({
                name: bet.utlName,
                id: bet.user_tournament_id,
            })),
        }
    })
    const sortedModels = orderBy(
        models,
        [
            'score',
            ({gumblers}) => gumblers.length,
        ],
        [
            'desc',
            'desc',
        ]
    )

    const cells = [
        {
            id: 'admin',
            classes: {
                header: 'admin',
                cell: 'admin',
            },
            header: '',
            getter: (bet: BetInstance) => bet.id,
        },
        {
            id: 'betValue',
            header: 'ניחוש',
            getter: (question: BetInstance) => (
                <SpecialAnswer type={type} answer={question.answer} isVertical />
            ),
        },
        {
            id: 'gumblers',
            classes: {
                cell: 'gumblersCell'
            },
            header: 'מנחשים',
            getter: (bet: BetInstance) => (
                <GumblersList gumblers={bet.gumblers} />
            ),
        },
        {
            id: 'score',
            classes: {
                cell: 'scoreCell',
                header: 'scoreHeaderCell',
            },
            header: 'ניקוד',
            getter: (bet: BetInstance) => bet.score,
        },
    ]

    return (
        <div className={`LB-QuestionBetGumblersList ${tournamentClass}`}>
            <div className={`QuestionBetGumblersList-header`}>
                <h4 className='QuestionBetGumblersList-title'>{name}</h4>
            </div>
            <div className='LB-GumblersTable'>
                <CustomTable models={sortedModels} cells={cells}/>
            </div>
        </div>
    )
}

export default QuestionBetGumblersList
