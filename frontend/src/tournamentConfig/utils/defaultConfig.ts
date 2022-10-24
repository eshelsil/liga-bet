import { TournamentScoreConfig } from '../../types';

export function generateDefaultScoresConfig(): TournamentScoreConfig {
	return {
		gameBets: {
			groupStage: {
				winnerSide: 10,
				result: 20,
			},
			knockout: {
				qualifier: 15,
				winnerSide: 15,
				result: 60,
			},
			bonuses: {
				final: {
					qualifier: 10,
					winnerSide: 10,
					result: 30,
				},
				semiFinal: {
					qualifier: 5,
					winnerSide: 5,
					result: 15,
				}
			}
		},
		groupRankBets: {
			perfect: 60,
			minorMistake: 30,
		},
		specialBets: {
			offensiveTeam: 50,
			winner: {
				quarterFinal: 20,
				semiFinal: 30,
				final: 110,
				winning: 150,
			},
			runnerUp: {
				quarterFinal: 20,
				semiFinal: 20,
				final: 100,
			},
			mvp: 100,
			topAssists: 100,
			topScorer: {
				correct: 40,
				eachGoal: 20,
			},
		},
	}
}