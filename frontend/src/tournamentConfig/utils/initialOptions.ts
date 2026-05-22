import { CompetitionStageName, KnockoutStage, SpecialQuestionType } from '../../types';
import { ScoresConfigFromatted } from '../../_selectors';

function isEnabled(
	flag: boolean,
	value: number,
){
	const disabled = flag === false || !(value > 0)
	return ! disabled
}

export function getInitialOptionsConfig(config: ScoresConfigFromatted){
	const {specialBets: questionsConfig, gameBets: gameBetsConfig, specialQuestionFlags } = config

	return {
		specialQuestionFlags: {
			[SpecialQuestionType.Winner]: true,
			[SpecialQuestionType.RunnerUp]: isEnabled(specialQuestionFlags?.runnerUp, questionsConfig.runnerUp.final),
			[SpecialQuestionType.TopScorer]: true,
			[SpecialQuestionType.TopAssists]: isEnabled(specialQuestionFlags?.topAssists, questionsConfig.topAssists.correct),
			[SpecialQuestionType.MVP]: isEnabled(specialQuestionFlags?.mvp, questionsConfig.mvp ),
			[SpecialQuestionType.OffensiveTeamGroupStage]:  isEnabled(specialQuestionFlags?.offensiveTeam, questionsConfig.offensiveTeam ),
			[SpecialQuestionType.DefensiveTeamGroupStage]:  isEnabled(specialQuestionFlags?.defensiveTeam, questionsConfig.defensiveTeam ),
		},
		specialQuestionOptions: {
			roadToFinal: {
				[KnockoutStage.SemiFinal]: questionsConfig.runnerUp.semiFinal > 0 || questionsConfig.winner.semiFinal > 0,
				[KnockoutStage.QuarterFinal]: questionsConfig.runnerUp.quarterFinal > 0 || questionsConfig.winner.quarterFinal > 0,
				[CompetitionStageName.Last16]: questionsConfig.runnerUp[CompetitionStageName.Last16] > 0 || questionsConfig.winner[CompetitionStageName.Last16] > 0,
			}
		},
		gameBetOptions: {
			qualifier: gameBetsConfig.knockout.qualifier > 0,
			bonuses: {
				[KnockoutStage.Final]: gameBetsConfig.bonuses?.final?.result > 0
					|| gameBetsConfig.bonuses?.final?.winnerSide > 0
					|| gameBetsConfig.bonuses?.final?.qualifier > 0,
				[KnockoutStage.SemiFinal]: gameBetsConfig.bonuses?.semiFinal?.result > 0
					|| gameBetsConfig.bonuses?.semiFinal?.winnerSide > 0
					|| gameBetsConfig.bonuses?.semiFinal?.qualifier > 0,
				[KnockoutStage.QuarterFinal]: gameBetsConfig.bonuses?.quarterFinal?.result > 0
					|| gameBetsConfig.bonuses?.quarterFinal?.winnerSide > 0
					|| gameBetsConfig.bonuses?.quarterFinal?.qualifier > 0,
			}
		}
	}
}