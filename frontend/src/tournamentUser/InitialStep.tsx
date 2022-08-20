import React from 'react';
import { MyUtlsById } from '../types';
import ChooseFromExistingUtls from './ChooseFromExistingUtls';


interface Props {
    selectUtl: (id: number) => any,
    onJoin: () => void,
    onCreate: () => void,
    myUtls: MyUtlsById,
}

function InitialStep({
    selectUtl,
    onJoin,
    onCreate,
    myUtls,
}: Props){
    const hasUtls = Object.keys(myUtls).length > 0;
    return  (
        <div>
            <h1>אנא בחר טורניר</h1>
            {hasUtls && (<>
                <h3>הטורנירים בהם אתה משתתף</h3>
                <ChooseFromExistingUtls myUtls={myUtls} selectUtl={selectUtl} />
            </>)}
            <h3>הצטרף לטורניר חדש</h3>
            <button onClick={onCreate}>צור טורניר חדש</button>
            <button onClick={onJoin} >הצטרף לטורניר קיים</button>
        </div>
    );
}


export default InitialStep;