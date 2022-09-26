import React from 'react';
import { Player } from '../types';
import TeamWithFlag from '../widgets/TeamWithFlag';


function PlayerAnswerView({
    player,
}: {
    player: Player,
} ){
    const { name, team } = player;
    if (!team){
        return (<>name</>);
    }
    return (
        <TeamWithFlag name={name} crest_url={team.crest_url} />
    );
}


export default PlayerAnswerView;