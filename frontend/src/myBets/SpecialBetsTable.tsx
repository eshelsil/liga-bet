import React from 'react'
import { Dictionary, orderBy } from 'lodash'
import { QuestionBetWithRelations, SpecialQuestionAnswer } from '../types'
import { specialQuestionsOrder } from '../utils'
import { SpecialAnswerSmall } from '../widgets/specialAnswer'
import CustomTable from '../widgets/Table/CustomTable'


const LiveBetScore = ({ liveScore, prevScore }: { liveScore: number, prevScore: number }) => {
    const addedScore = liveScore - prevScore
    const hasChange = addedScore != 0
    return (
        <div className='LB-LiveBetScore'>
            {hasChange && (<>
                <div className='LiveBetScore-prev'>{prevScore}</div>
                <div className='LiveBetScore-live LiveBetScore-addedScore'>
                    (+{addedScore})
                </div>
            </>)}
            {!hasChange && (
                <div className='LiveBetScore-live'>{liveScore}</div>
            )}
        </div>
    )    
}


interface Props {
    bets: QuestionBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
    liveBetsById?: Dictionary<QuestionBetWithRelations> 
    liveAnswersByQuestionId?: Record<number, SpecialQuestionAnswer[]>
    showLive?: boolean,
}

const SpecialBetsTable = ({ bets, headers, showLive, liveBetsById = {}, liveAnswersByQuestionId = {} }: Props) => {
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
			getter: (model: QuestionBetWithRelations) => {
                const liveAnswers = liveAnswersByQuestionId[model.relatedQuestion.id]
                const showLiveAnswers = showLive && liveAnswersByQuestionId[model.relatedQuestion.id]?.length > 0
                const answersToShow = showLiveAnswers ? liveAnswers : model.relatedQuestion.answer
                return (<>
                    {answersToShow.map((answer) => (
                        <SpecialAnswerSmall
                            key={answer.id}
                            answer={answer}
                            type={model.relatedQuestion.type}
                        />
                    ))}
                </>)
            },
		},
		{
			id: 'score',
			header: 'נק\'',
            classes: {
                cell: 'scoreCell',
            },
			getter: (model: QuestionBetWithRelations) => (
                (showLive && liveBetsById[model.id])
                    ? <LiveBetScore prevScore={model.score} liveScore={liveBetsById[model.id].score} />
                    : model.score
            ),
		},
    ]

    return (
        <div className='LB-SpecialBetsTable'>
            <CustomTable
                models={sortedBets}
                cells={cells}
            />
        </div>
    )
}

export default SpecialBetsTable
