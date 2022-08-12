import React from 'react';
import { useSelector } from 'react-redux';
import { ClosedQuestionBetsSelector } from '../_selectors/questionBets';
import QuestionBetsView from './QuestionBetsView';


const ClosedQuestionBets = () => {
    const { questions, betsByQuestionId } = useSelector(ClosedQuestionBetsSelector);
    return <QuestionBetsView
        questions={questions}
        betsByQuestionId={betsByQuestionId}
    />
};

export default ClosedQuestionBets;