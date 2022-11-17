import React, { useState } from 'react'
import { Dictionary } from '@reduxjs/toolkit'
import { QuestionBetWithRelations, SpecialQuestion } from '../types'
import { valuesOf } from '../utils'
import SimpleTabs from '../widgets/Tabs/Tabs'
import QuestionBetGumblersList from './QuestionBetGumblersList'
import './QuestionBetsView.scss'
import '../styles/closedBets/GumblersTable.scss'



interface Props {
    questions: Dictionary<SpecialQuestion>
    betsByQuestionId: Dictionary<QuestionBetWithRelations[]>
}

const QuestionBetsView = ({ questions, betsByQuestionId }: Props) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = valuesOf(questions).map(question => ({
        id: question.type,
        label: question.name,
        children: (
            <QuestionBetGumblersList question={question} bets={betsByQuestionId[question.id]}/>
        )
    }))
    return (
        <div className='LB-QuestionBetsView'>
            <h1 className='LB-TitleText'>ניחושים מיוחדים</h1>
            <SimpleTabs
                tabs={tabs}
                index={selectedTab}
                onChange={setSelectedTab}
            />
        </div>
    )
}

export default QuestionBetsView
