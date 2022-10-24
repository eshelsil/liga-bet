import React from 'react';
import { CompetitionStageName, SpecialQuestionType } from '../../../types';
import { ScoreConfigFormProps } from '../../types';
import ScoreInput from '../ScoreInput';


interface Props extends ScoreConfigFormProps {
	stageName: CompetitionStageName,
	questionType: SpecialQuestionType.Winner | SpecialQuestionType.RunnerUp,
	label?: string,
	disabled?: boolean,
}

function TeamAchivementStageConfig({
	stageName,
	questionType,
	label,
	disabled,
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
				...register(`specialBets.${questionType}.${stageName}`),
				disabled,
			}}
			clearErrors={() => clearErrors(`specialBets.${questionType}.${stageName}`)}
		/>
	);
}


export default TeamAchivementStageConfig;