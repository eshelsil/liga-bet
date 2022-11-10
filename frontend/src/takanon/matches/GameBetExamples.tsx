import React from 'react';
import { GameBetScoreConfig } from '../../types';
import { GameExample } from './types';
import GameExampleView from './GameExampleView';
import ExamplesAccordion from '../ExamplesAccordion';


function GameBetExamples({
    examples,
    scoresConfig,
}: {
    examples: GameExample[]
    scoresConfig: GameBetScoreConfig
}) {
    return (
        <ExamplesAccordion>
            <div>
                {examples.map((example, index) => (
                    <GameExampleView
                        key={index}
                        example={example}
                        scoresConfig={scoresConfig}
                    />
                ))}
            </div>
        </ExamplesAccordion>
    )
}

export default GameBetExamples
