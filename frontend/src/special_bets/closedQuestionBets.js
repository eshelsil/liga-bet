import React, { useEffect } from 'react';
import QuestionBetsView from './questionBetsView';
import { connect } from 'react-redux';
import { ClosedQuestionBetsSelector } from '../_selectors/questionBets';
import { fetch_users } from '../_actions/users';
import { fetch_questions } from '../_actions/specialQuestions';
import { fetch_bets } from '../_actions/bets';





const ClosedQuestionBets = ({
    questions,
    betsByQuestionId,
    fetch_users,
    fetch_bets,
    fetch_questions,
}) => {
    useEffect(()=>{
		fetch_users();
        fetch_bets();
        fetch_questions();
	}, []);
    return <QuestionBetsView
        questions={questions}
        betsByQuestionId={betsByQuestionId}
    />
};

const mapDispatchToProps = {
    fetch_users,
    fetch_bets,
    fetch_questions,
}

export default connect(ClosedQuestionBetsSelector, mapDispatchToProps)(ClosedQuestionBets);