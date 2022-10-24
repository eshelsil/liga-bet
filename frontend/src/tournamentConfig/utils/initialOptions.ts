import { KnockoutStage, SpecialQuestionType, TournamentScoreConfig } from '../../types';

export function getInitialOptionsConfig(config: TournamentScoreConfig){
	const questionsConfig = config.specialBets;
	const gameBetsConfig = config.gameBets;
	return {
		chosenSpecialQuestions: {
			[SpecialQuestionType.Winner]: true,
			[SpecialQuestionType.RunnerUp]: questionsConfig.runnerUp.final > 0,
			[SpecialQuestionType.TopScorer]: true,
			[SpecialQuestionType.TopAssists]: questionsConfig.topAssists > 0,
			[SpecialQuestionType.MVP]: questionsConfig.mvp > 0,
			[SpecialQuestionType.OffensiveTeamGroupStage]: questionsConfig.offensiveTeam > 0,
		},
		specialQuestionOptions: {
			roadToFinal: {
				[KnockoutStage.SemiFinal]: questionsConfig.runnerUp.semiFinal > 0 || questionsConfig.winner.semiFinal > 0,
				[KnockoutStage.QuarterFinal]: questionsConfig.runnerUp.quarterFinal > 0 || questionsConfig.winner.quarterFinal > 0,
			}
		},
		gameBetOptions: {
			qualifier: gameBetsConfig.knockout.qualifier > 0,
			bonuses: {
				[KnockoutStage.Final]: gameBetsConfig.bonuses.final.result > 0
					|| gameBetsConfig.bonuses.final.winnerSide > 0
					|| gameBetsConfig.bonuses.final.qualifier > 0,
				[KnockoutStage.SemiFinal]: gameBetsConfig.bonuses.semiFinal.result > 0
					|| gameBetsConfig.bonuses.semiFinal.winnerSide > 0
					|| gameBetsConfig.bonuses.semiFinal.qualifier > 0,
			}
		}
	}
}