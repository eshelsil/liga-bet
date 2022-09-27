import { Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SpecialQuestionWithABet } from '../types';
import { hasPlayerAnswer, hasTeamAnswer } from '../utils';
import TeamInput from './TeamInput';
import SpecialAnswerView from '../widgets/specialAnswer/SpecialAnswer';
import { QuestionBetParams } from './types';
import PlayerInput from './PlayerInput';


interface Props {
    questionWithBet: SpecialQuestionWithABet,
    sendBet: (params: QuestionBetParams) => Promise<void>,
}

function OpenQuestionBetView({
    questionWithBet,
    sendBet,
}: Props ){
    const [answer, setAnswer] = useState<number>();
    const { name, bet, id, type } = questionWithBet;
    const { answer: betAnswer } = bet || {};
    const hasBet = !!bet;
    const isTeamQuestion = hasTeamAnswer(questionWithBet);
    const isPlayerQuestion = hasPlayerAnswer(questionWithBet);
    const submitBet = async () => {
        await sendBet({questionId: id, answer});
    }

    useEffect(() => {
        if (betAnswer && !answer){
            setAnswer(betAnswer.id);
        }
    }, [betAnswer])
    

    return (
        <Grid>
            <div className={'LigaBet-OpenQuestionBetView'}>
                <div className='header'>
                    <h3 className='name'>{name}</h3>
                </div>
                {hasBet && (
                    <div className='existing_bet'>
                        <SpecialAnswerView 
                            answer={betAnswer}
                            type={type}
                        />
                    </div>
                )}
                <div className='content'>
                    <div>
                        {isTeamQuestion && (
                            <TeamInput value={answer} onChange={setAnswer}/>
                        )}
                        {isPlayerQuestion && (
                            <PlayerInput value={answer} onChange={setAnswer} />
                        )}
                    </div>
                    <div className='buttonContainer'>
                        <Button variant='contained' color='primary'
                            onClick={submitBet}
                        >
                            שלח
                        </Button>
                    </div>
                </div>
            </div>
        </Grid>
    );
}


export default OpenQuestionBetView;