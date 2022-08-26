import React from 'react';
import { UtlWithTournament } from '../types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


interface Props {
    utl: UtlWithTournament,
    onClick: () => void,
}

function UtlOption({
    utl,
    onClick,
}: Props){
    const {tournament, name} = utl;
    return (
        <div className='UtlOption' onClick={onClick}>
            <p>{tournament.name}</p>
            <div>
                <AccountCircleIcon />
                <p>{name}</p>
            </div>
            <div className='admin'>{utl.id}</div>
        </div>
    );
}


export default UtlOption;