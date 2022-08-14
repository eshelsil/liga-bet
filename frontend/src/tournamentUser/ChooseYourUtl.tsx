import React, { ReactNode, useEffect } from 'react';
import { connect } from 'react-redux';
import { MyUtlsById } from '../types';

import { selectUtl } from '../_actions/tournamentUser';
import { MyUtlsSelector } from '../_selectors';
import UtlOption from './UtlOption';
import './style.scss';



interface Props {
    selectUtl: (id: number) => Promise<void>,
    myUtls: MyUtlsById,
}

function ChooseYourUtl({
    selectUtl,
    myUtls,
}: Props){

    return <div className='ChooseYourUtl'>
        {Object.values(myUtls).map(utl => (
            <UtlOption
                onClick={() => selectUtl(utl.id)}
                utl={utl}
                key={utl.id}
            />
        ))}
    </div>
}

const mapDispatchToProps = {
    selectUtl,
}


export default connect(MyUtlsSelector, mapDispatchToProps)(ChooseYourUtl);