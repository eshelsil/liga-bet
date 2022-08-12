import React from 'react';
import { Team } from '../types';
import TeamWithFlag from '../widgets/TeamWithFlag';

function TeamStanding(team: Team){
    const {
        crest_url,
        name,
    } = team;
    return (
        <div className="team_row bg-info" style={{
            padding: 8,
            width: '100%'
        }}>
            <TeamWithFlag name={name} crest_url={crest_url} />
        </div>
    );
}

export default TeamStanding;