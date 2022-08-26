import React, { useState } from 'react';
import { connect } from 'react-redux';
import { MyUtlsById } from '../types';

import { selectUtl, createUtl } from '../_actions/tournamentUser';
import { MyUtlsSelector } from '../_selectors';
import InitialStep from './InitialStep';
import CreateNewTournament from './CreateNewTournament';
import JoinTournament from './JoinTournament';
import './style.scss';


enum Step {
    Initial = 'initial',
    NewTournamet = 'new_tournament',
    JoinTournament = 'join',
}
interface Props {
    selectUtl: (id: number) => any,
    createUtl: (...args: any) => any,
    myUtls: MyUtlsById,
}

function ChooseYourUtl({
    selectUtl,
    createUtl,
    myUtls,
}: Props){
    const [step, setStep] = useState<Step>(Step.Initial);

    const goToInitialStep = () => setStep(Step.Initial);
    const goToJoin = () => setStep(Step.JoinTournament);
    const goToCreate = () => setStep(Step.NewTournamet);
    
    return  (
        <div>
            {step === Step.Initial && (
                <InitialStep
                    myUtls={myUtls}
                    selectUtl={selectUtl}
                    onJoin={goToJoin}
                    onCreate={goToCreate}
                />
            )}
            {step === Step.JoinTournament && (
                <JoinTournament
                    onJoin={createUtl}
                    goBack={goToInitialStep}
                />
            )}
            {step === Step.NewTournamet && (
                <CreateNewTournament
                    onCreateUtl={createUtl}
                    goBack={goToInitialStep}
                />
            )}
        </div>
    );
}

const mapDispatchToProps = {
    selectUtl,
    createUtl,
}


export default connect(MyUtlsSelector, mapDispatchToProps)(ChooseYourUtl);