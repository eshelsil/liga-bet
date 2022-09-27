import React from 'react';
import { Team } from '../../types';
import TeamWithFlag from '../TeamWithFlag';


function TeamAnswerView({
    team,
}: {
    team: Team,
} ){
    const { name, crest_url } = team;
    return (
        <TeamWithFlag name={name} crest_url={crest_url} />
    );
}


export default TeamAnswerView;