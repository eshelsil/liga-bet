import React from 'react';
import { GameBetScoreConfig, GameStage } from '../../../types';
import { ScoreConfigFormProps } from '../../types';
import ScoreInput from '../ScoreInput';


interface Props extends ScoreConfigFormProps {
	stageName: GameStage,
	gameConfigType: keyof GameBetScoreConfig,
	label?: string,
}

function MatchBetStageConfig({
	stageName,
	gameConfigType,
	label,
	errors,
	register,
	clearErrors,
} : Props) {
	const error = errors.gameBets ? errors.gameBets[stageName]?.result?.message : null;
	return (
		<ScoreInput
			error={error}
			label={label}
			InputProps={{
				...register(`gameBets.${stageName}.${gameConfigType}`)
			}}
			clearErrors={() => clearErrors(`gameBets.${stageName}.${gameConfigType}`)}
		/>
	);
}


export default MatchBetStageConfig;