import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SpecialQuestionType, TournamentScoreConfig } from '../types';

export interface ScoreConfigForm extends TournamentScoreConfig {
	chosenSpecialQuestions: Record<SpecialQuestionType, boolean>,
}

export type FormErrors = FormState<ScoreConfigForm>['errors']

export interface ScoreConfigFormProps {
	register: UseFormRegister<ScoreConfigForm>,
	errors: FormErrors,
	clearErrors: UseFormClearErrors<ScoreConfigForm>,
	watch: UseFormWatch<ScoreConfigForm>,
	setValue: UseFormSetValue<ScoreConfigForm>,
}