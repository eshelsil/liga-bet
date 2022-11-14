import { Dictionary } from '@reduxjs/toolkit'
import React from 'react'
import { QuestionBetWithRelations, SpecialQuestion } from '../types'
import { getSpecialQuestionName } from '../utils'
import QuestionBetsList from './QuestionBetList'
import QuestionTab from './QuestionTab'

interface Props {
    questions: Dictionary<SpecialQuestion>
    betsByQuestionId: Dictionary<QuestionBetWithRelations[]>
}

const QuestionBetsView = ({ questions, betsByQuestionId }: Props) => {
    return (
        <div>
            <h1 className='LB-TitleText'>ניחושים מיוחדים</h1>
            <div className="float-right">
                <ul className="nav nav-tabs" style={{ paddingRight: 0 }}>
                    {Object.values(questions).map((question) => (
                        <QuestionTab
                            key={question.id}
                            name={getSpecialQuestionName(question)}
                            id={question.id}
                        />
                    ))}
                </ul>

                <div className="tab-content" style={{ marginTop: 25 }}>
                    {Object.values(questions).map((question, i) => (
                        <QuestionBetsList
                            key={question.id}
                            name={getSpecialQuestionName(question)}
                            id={question.id}
                            bets={betsByQuestionId[question.id]}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuestionBetsView
