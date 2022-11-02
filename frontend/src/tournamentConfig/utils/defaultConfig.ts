import { TournamentScoreConfig } from '../../types';

export function generateDefaultScoresConfig(): TournamentScoreConfig {
	return {
		gameBets: {
			groupStage: {
				winnerSide: 2,
				result: 4,
			},
			knockout: {
				qualifier: 3,
				winnerSide: 3,
				result: 12,
			},
			bonuses: {
				final: {
					qualifier: 2,
					winnerSide: 2,
					result: 4,
				},
				semiFinal: {
					qualifier: 1,
					winnerSide: 1,
					result: 2,
				}
			}
		},
		groupRankBets: {
			perfect: 12,
			minorMistake: 6,
		},
		specialBets: {
			offensiveTeam: 10,
			winner: {
				quarterFinal: 4,
				semiFinal: 6,
				final: 20,
				winning: 30,
			},
			runnerUp: {
				quarterFinal: 4,
				semiFinal: 6,
				final: 20,
			},
			mvp: 20,
			topAssists: 20,
			topScorer: {
				correct: 8,
				eachGoal: 4,
			},
		},
		specialQuestionFlags: {
			winner: true,
			runnerUp: true,
			topScorer: true,
			mvp: true,
			topAssists: true,
			offensiveTeam: true,
		}
	}
}