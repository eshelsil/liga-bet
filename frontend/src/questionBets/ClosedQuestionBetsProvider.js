import React from 'react';
import QuestionBetsView from './QuestionBetsView';
import { connect } from 'react-redux';
import { ClosedQuestionBetsSelector } from '../_selectors/questionBets.ts';


const ClosedQuestionBets = ({
    questions,
    betsByQuestionId,
}) => {
    
    return <QuestionBetsView
        questions={questions}
        betsByQuestionId={betsByQuestionId}
    />
};

export default connect(ClosedQuestionBetsSelector)(ClosedQuestionBets);