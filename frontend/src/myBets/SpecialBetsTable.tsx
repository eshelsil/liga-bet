import { orderBy } from 'lodash'
import React from 'react'
import { QuestionBetWithRelations } from '../types'
import { specialQuestionsOrder } from '../utils'
import { SpecialAnswerSmall } from '../widgets/specialAnswer'
import CustomTable from '../widgets/Table/CustomTable'


interface Props {
    bets: QuestionBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
    liveBetIds?: number[]
    showLive?: boolean,
}


const SpecialBetsTable = ({ bets, headers, showLive, liveBetIds = [] }: Props) => {
    const sortedBets = orderBy(bets, bet => specialQuestionsOrder.indexOf(bet.relatedQuestion.type))

	const cells = [
		{
			id: 'id',
			header: 'מזהה',
			classes: {
                header: 'admin',
                cell: 'admin',
            },
			getter: (model: QuestionBetWithRelations) => model.id,
		},
		{
			id: 'questionName',
			header: '',
            classes: {
                cell: 'questionNameCell',
            },
			getter: (model: QuestionBetWithRelations) => model.relatedQuestion.name,
		},
		{
			id: 'bet',
			header: headers?.bet ?? 'ניחוש',
            classes: {
                cell: 'alignToTop'
            },
			getter: (model: QuestionBetWithRelations) => (
                <SpecialAnswerSmall
                    answer={model.answer}
                    type={model.relatedQuestion.type}
                />
            ),
		},
		{
			id: 'result',
			header: headers?.result ?? 'תוצאה',
			getter: (model: QuestionBetWithRelations) => (<>
                {model.relatedQuestion.answer.map((answer) => (
                    <SpecialAnswerSmall
                        key={answer.id}
                        answer={answer}
                        type={model.relatedQuestion.type}
                    />
                ))}
            </>),
		},
		{
			id: 'score',
			header: 'נק\'',
            classes: {
                cell: 'scoreCell',
            },
			getter: (model: QuestionBetWithRelations) => model.score,
		},
    ]

    const getRowClassName = (model: QuestionBetWithRelations) => {
        return (showLive && liveBetIds.includes(model.id) ) ? 'SpecialBetsTable-live' : ''
    }
	
    return (
        <div className='LB-SpecialBetsTable'>
            <CustomTable
                models={sortedBets}
                cells={cells}
                getRowClassName={getRowClassName}
            />
        </div>
    )
}

export default SpecialBetsTable
