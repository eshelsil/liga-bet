import { Control, FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { KnockoutStage } from '../types';
import { ScoresConfigFromatted } from '../_selectors';

export interface ScoreConfigForm extends ScoresConfigFromatted {
	specialQuestionOptions: {
		roadToFinal: {
			[KnockoutStage.SemiFinal]: boolean
			[KnockoutStage.QuarterFinal]: boolean
		}
	},
	gameBetOptions: {
		qualifier: boolean,
		bonuses: {
			[KnockoutStage.Final]: boolean
			[KnockoutStage.SemiFinal]: boolean
		}
	},
}


export type FormErrors = FormState<ScoreConfigForm>['errors']

export interface ScoreConfigFormProps {
	register: UseFormRegister<ScoreConfigForm>,
	errors: FormErrors,
	clearErrors: UseFormClearErrors<ScoreConfigForm>,
	watch: UseFormWatch<ScoreConfigForm>,
	control: Control<ScoreConfigForm, any>,
	setValue: UseFormSetValue<ScoreConfigForm>,
}

export type FormAttributeName = Parameters<ScoreConfigFormProps['register']>[0]

export interface SpecialQuestionConfigProps extends ScoreConfigFormProps {
	disabled: boolean,
}