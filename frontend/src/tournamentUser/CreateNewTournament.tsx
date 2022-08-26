import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CompetitionsById, Tournament } from '../types';
import { createNewTournament, fetchOwnedTournaments } from '../_actions/tournament';
import { fetchAndStoreCompetitions } from '../_actions/competition';
import { CreateNewTournamentSelector } from '../_selectors';
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';



interface Props {
    onCreateUtl: (...args: any) => any,
    createNewTournament: (...args: any) => any,
    fetchOwnedTournaments: (...args: any) => any,
    fetchAndStoreCompetitions: (...args: any) => any,
    goBack: () => void,
    competitionsById: CompetitionsById,
    tournamentWithNoUtl?: Tournament,
}

function CreateNewTournament({
    onCreateUtl,
    createNewTournament,
    goBack,
    competitionsById,
    tournamentWithNoUtl,
    fetchAndStoreCompetitions,
    fetchOwnedTournaments,
}: Props){
    const [nickname, setNickname] = useState('');
    const [name, setName] = useState('');
    const [competition, setCompetition] = useState<number>();

    function createTournament(){
        createNewTournament({competitionId: competition, name});
    }
    function createUtl(){
        onCreateUtl({tournamentCode: tournamentWithNoUtl?.code, name: nickname});
    }

    useEffect(()=>{
        fetchAndStoreCompetitions();
        fetchOwnedTournaments();
    }, [])
    
    return  (
        <div>
            <h1>צור טורניר חדש</h1>
            {tournamentWithNoUtl && (<>
                <h4>בחר לעצמך כינוי</h4>
                <TextField value={nickname} onChange={(e)=>setNickname(e.target.value)}/>
                <Button onClick={createUtl}>
                    המשך
                </Button>
                <Button onClick={goBack}>
                    חזור
                </Button>
            </>)}
            {!tournamentWithNoUtl && (<>
                <h4>בחר תחרות</h4>
                    <RadioGroup
                        value={competition || null}
                        onChange={(e)=>setCompetition(Number(e.target.value))}
                        name="competitions"
                    >
                        {Object.values(competitionsById).map(competition => (
                            <FormControlLabel key={competition.id} value={competition.id} control={<Radio />} label={competition.name} />
                        ))}
                    </RadioGroup>
                <div>
                    <p>שם הטורניר</p>
                    <TextField value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div>
                    <Button onClick={createTournament}>
                        צור טורניר
                    </Button>
                    <Button onClick={goBack}>
                        חזור
                    </Button>
                </div>  
            </>)}
        </div>
    );
}

const mapDispatchToProps = {
    createNewTournament,
    fetchAndStoreCompetitions,
    fetchOwnedTournaments,
}


export default connect(CreateNewTournamentSelector, mapDispatchToProps)(CreateNewTournament);