import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dictionary } from '@reduxjs/toolkit'
import { QuestionBetWithRelations, SpecialQuestion } from '../types'
import { getSpecialQuestionName, valuesOf } from '../utils'
import SimpleTabs from '../widgets/Tabs/Tabs'
import QuestionBetGumblersList from './QuestionBetGumblersList'
import './QuestionBetsView.scss'
import '../styles/closedBets/GumblersTable.scss'



interface Props {
    questions: Dictionary<SpecialQuestion>
    betsByQuestionId: Dictionary<QuestionBetWithRelations[]>
}

const QuestionBetsView = ({ questions, betsByQuestionId }: Props) => {
    const { t } = useTranslation('questionBets')
    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = valuesOf(questions).map(question => ({
        id: question.type,
        label: getSpecialQuestionName(question),
        children: (
            <QuestionBetGumblersList question={question} bets={betsByQuestionId[question.id]}/>
        )
    }))
    return (
        <div className='LB-QuestionBetsView'>
            <h2 className='LB-TitleText'>{t('title')}</h2>
            <SimpleTabs
                tabs={tabs}
                index={selectedTab}
                onChange={setSelectedTab}
            />
        </div>
    )
}

export default QuestionBetsView
