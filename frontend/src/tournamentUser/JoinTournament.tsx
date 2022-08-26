import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';


interface Props {
    goBack: () => void,
    onJoin: (...args: any) => any,
}

function JoinTournament({
    goBack,
    onJoin,
}: Props){
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    function join(){
        onJoin({tournamentCode: code, name})
    }
    
    return  (
        <div>
            <div>
                <h6>קוד טורניר</h6>
                <TextField value={code} onChange={(e)=>setCode(e.target.value)}/>
            </div>
                <h6>כינוי</h6>
                <TextField value={name} onChange={(e)=>setName(e.target.value)}/>
            <div>
            </div>
            <Button onClick={join}>
                הצטרף לטורניר
            </Button>
            <Button onClick={goBack}>
                חזור
            </Button>
        </div>
    );
}


export default JoinTournament;