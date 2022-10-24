import React from 'react';
import { GameBetScoreConfig, GameBetType, KnockoutStage } from '../../../types';
import { FormAttributeName, ScoreConfigFormProps } from '../../types';
import ScoreInput from '../ScoreInput';


function getError(
	errors: ScoreConfigFormProps['errors'],
	gameBetType: GameBetType,
	koStageName?: KnockoutStage,
): string{
	if (!errors.gameBets) return null
	if (gameBetType === GameBetType.GroupStage) {
		return errors.gameBets.groupStage?.result?.message
	}
	if (!koStageName) {
		return errors.gameBets.knockout?.result?.message
	}
	return errors.gameBets.bonuses[koStageName]?.result?.message
}

function getAttributeName(
	attribute: keyof GameBetScoreConfig,
	gameBetType: GameBetType,
	koStageName?: KnockoutStage,
): FormAttributeName{
	if (gameBetType === GameBetType.Bonus) {
		return `gameBets.bonuses.${koStageName}.${attribute}`
	}
	return `gameBets.${gameBetType}.${attribute}`
}

interface Props extends ScoreConfigFormProps {
	attribute: keyof GameBetScoreConfig,
	gameBetType: GameBetType,
	koStageName?: KnockoutStage,
	label?: string,
	disabled?: boolean,
}

function MatchBetStageConfig({
	attribute,
	gameBetType,
	koStageName,
	label,
	disabled,
	errors,
	register,
	clearErrors,
} : Props) {
	const error = getError(errors, gameBetType, koStageName)
	const attributeName = getAttributeName(attribute, gameBetType, koStageName)
	return (
		<ScoreInput
			error={error}
			label={label}
			InputProps={{
				...register(attributeName, {
					valueAsNumber: true,
				}),
				disabled,
			}}
			clearErrors={() => clearErrors(attributeName)}
		/>
	);
}


export default MatchBetStageConfig;