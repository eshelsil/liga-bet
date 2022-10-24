import { CompetitionStageName, MatchBetsScoreConfig, SpecialQuestionBetScoreConfig, SpecialQuestionType, TournamentScoreConfig } from '../../types';
import { keysOf } from '../../utils';
import { ScoreConfigForm } from '../types';


export function getGameParams(config: MatchBetsScoreConfig, options: ScoreConfigForm['gameBetOptions']): MatchBetsScoreConfig {
	const params = {
		...config,
	}
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


function getEmptySpecialBetConfig<T extends keyof SpecialQuestionBetScoreConfig>(type: T): SpecialQuestionBetScoreConfig[T]{
	const emptySpecialBetConfig = {
		[SpecialQuestionType.TopScorer]: {
			correct: 0,
			eachGoal: 0,
		},
		[SpecialQuestionType.Winner]: {
			[CompetitionStageName.Winning]: 0,
			[CompetitionStageName.Final]: 0,
			[CompetitionStageName.SemiFinal]: 0,
			[CompetitionStageName.QuarterFinal]: 0,
		},
		[SpecialQuestionType.RunnerUp]: {
			[CompetitionStageName.Final]: 0,
			[CompetitionStageName.SemiFinal]: 0,
			[CompetitionStageName.QuarterFinal]: 0,
		},
		[SpecialQuestionType.TopAssists]: 0,
		[SpecialQuestionType.MVP]: 0,
		[SpecialQuestionType.OffensiveTeamGroupStage]: 0,
	}
	return emptySpecialBetConfig[type];
}

function getSpecialBetParams(config: ScoreConfigForm): SpecialQuestionBetScoreConfig {
	const params = {
		...config.specialBets
	}
	const { chosenSpecialQuestions, specialQuestionOptions } = config
	for (const type of keysOf(chosenSpecialQuestions)){
		if (!chosenSpecialQuestions[type]){
			params[type] = getEmptySpecialBetConfig[type]
		}
	}
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
	}
}