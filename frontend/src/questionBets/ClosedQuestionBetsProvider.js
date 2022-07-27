import React from 'react';
import QuestionBetsView from './QuestionBetsView';
import { connect } from 'react-redux';
import { ClosedQuestionBetsSelector } from '../_selectors';


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