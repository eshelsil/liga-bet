import React from 'react';
import MatchBetRules from '../../../takanon/matches/MatchBetRulesProvider';


function MatchBetsExplanation(){
    const exampleScoreConfig = {
        groupStage: {
            winnerSide: 10,
            result: 20,
        },
        knockout: {
            qualifier: 20,
            winnerSide: 20,
            result: 60,
        },
        bonuses: {
            final: {
                qualifier: 30,
                winnerSide: 30,
                result: 90,
            },
            semifinal: {
                qualifier: 25,
                winnerSide: 25,
                result: 75,
            }
        }
    };
	return (
		<div className='LigaBet-MatchBetsExplanation'>
            <MatchBetRules scoreConfig={exampleScoreConfig} />
		</div>
	);
}


export default MatchBetsExplanation;