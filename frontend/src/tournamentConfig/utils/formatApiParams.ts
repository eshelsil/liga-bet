import { MatchBetsScoreConfig, SpecialQuestionBetScoreConfig, SpecialQuestionType, TournamentScoreConfig } from '../../types';
import { keysOf } from '../../utils';
import { ScoreConfigForm } from '../types';
import { cloneDeep } from 'lodash';


export function getGameParams(config: MatchBetsScoreConfig, options: ScoreConfigForm['gameBetOptions']): MatchBetsScoreConfig {
	const params = cloneDeep(config)
	if (!options.qualifier){
		for (const bonusConfig of Object.values(params.bonuses)){
			bonusConfig.qualifier = 0
		}
		params.knockout.qualifier = 0
	}
	for (const koStageName of keysOf(params.bonuses)){
		if (!options.bonuses[koStageName]){
			params.bonuses[koStageName].result = 0
			params.bonuses[koStageName].winnerSide = 0
			params.bonuses[koStageName].qualifier = 0
		}
	}
	return params
}



function getSpecialBetParams(config: ScoreConfigForm): SpecialQuestionBetScoreConfig {
	const { specialBets, specialQuestionOptions} = config
	const params = cloneDeep(specialBets)
	for (const stage of keysOf(specialQuestionOptions.roadToFinal)){
		if (!specialQuestionOptions.roadToFinal[stage]){
			params[SpecialQuestionType.Winner][stage] = 0
			params[SpecialQuestionType.RunnerUp][stage] = 0
		}
	}
	return params;
}

export function mapFormStateToApiParams(formState: ScoreConfigForm): TournamentScoreConfig {
	return {
		gameBets: getGameParams(formState.gameBets, formState.gameBetOptions),
		groupRankBets: formState.groupRankBets,
		specialBets: getSpecialBetParams(formState),
		specialQuestionFlags: formState.specialQuestionFlags,
	}
}