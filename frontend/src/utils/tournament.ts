import { cloneDeep, mapValues } from 'lodash'
import { GameBetType, KnockoutStage, Tournament, TournamentStatus, GameBetScoreConfig, EachGoalBet, RoadToFinalBetScoreConfig, SpecialQuestionType, SpecialQuestionBetScoreConfig, MatchBetsScoreConfig, CompetitionStageName, CompetitionStatus, SpecialQuestionFlagConfig } from '../types'
import { ScoresConfigFromatted } from '../_selectors'
import { valuesOf } from './common'
import i18n from '@/i18n/config'

export function isTournamentStarted(tournament: Tournament) {
    const statuses = [TournamentStatus.Ongoing, TournamentStatus.Finished]
    return statuses.includes(tournament.status)
}

export function isTournamentOngoing(tournament: Tournament) {
    const statuses = [TournamentStatus.Ongoing]
    return statuses.includes(tournament.status)
}

// Keys (groupStage / knockout / final / ...) match the `utils:gameStages`
// locale resource. Proxy keeps the existing `gameStageToString[stage]` access
// working while staying language-aware.
export const gameStageToString = new Proxy(
    {} as Record<string, string>,
    {
        get: (_target, prop) =>
            i18n.t(`utils:gameStages.${String(prop)}`, {
                defaultValue: String(prop),
            }),
    }
)

export const koStageToNextCompetitionStage = {
    [KnockoutStage.Last32]: CompetitionStageName.Last16,
    [KnockoutStage.Last16]: CompetitionStageName.QuarterFinal,
    [KnockoutStage.QuarterFinal]: CompetitionStageName.SemiFinal,
    [KnockoutStage.SemiFinal]: CompetitionStageName.Final,
    [KnockoutStage.Final]: CompetitionStageName.Winning,
}

export function isGameBetScoreConfigEmpty(config: GameBetScoreConfig){
	for (const score of valuesOf(config)){
		if (score > 0) {
			return false
		}
	}
	return true
}

export function isTopScorerBetEmpty(config: EachGoalBet){
	for (const score of valuesOf(config)){
		if (score > 0) {
			return false
		}
	}
	return true
}

export function isRoadToFinalBetEmpty(config: RoadToFinalBetScoreConfig){
	for (const score of valuesOf(config)){
		if (score > 0) {
			return false
		}
	}
	return true
}

export function isSimpleQuestionBetEmpty(config: number){
	if (config > 0) {
		return false
	}
	return true
}

export function isQuestionBetEmpty<T extends keyof SpecialQuestionBetScoreConfig>(name: T, config: SpecialQuestionBetScoreConfig[T]) {
	if (name === SpecialQuestionType.TopScorer || name === SpecialQuestionType.TopAssists){
		return isTopScorerBetEmpty(config as EachGoalBet)
	}
	if ([ SpecialQuestionType.Winner, SpecialQuestionType.RunnerUp ].includes(name)){
		return isRoadToFinalBetEmpty(config as RoadToFinalBetScoreConfig)
	}
	return isSimpleQuestionBetEmpty(config as number)
}

export function formatGameBetsConfig(scoresConfig: MatchBetsScoreConfig): MatchBetsScoreConfig{
	const res = cloneDeep(scoresConfig)
	
	const hasQalifierBet = scoresConfig.knockout.qualifier > 0
	if (!hasQalifierBet) {
		delete res.knockout.qualifier['qualifier']
	}
	for (const [stage, config] of Object.entries(scoresConfig.bonuses)){
		if (!hasQalifierBet) {
			delete res['qualifier']
		}
		if (isGameBetScoreConfigEmpty(config)){
			delete res.bonuses[stage]
		}
	}
	return res
}

export function formatTopAssistsConfig(config: number | EachGoalBet): EachGoalBet {
	if (!isNaN(Number(config))){
		return {
			correct: Number(config),
			eachGoal: 0,
		}
	}
	return mapValues(config as EachGoalBet, score => Number(score))
}


export function generateDefaultScoresConfig(): ScoresConfigFromatted {
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
			topAssists: {
				correct: 8,
				eachGoal: 3,
			},
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
			defensiveTeam: false,
		}
	}
}

// A zeroed scores config. Used to fill sections that are entirely absent for a
// knockout_bracket tournament (whose `config.scores` carries only `bracket`), so
// the shared classic scoring selectors contribute 0 points instead of throwing.
export function generateEmptyScoresConfig(): ScoresConfigFromatted {
	return {
		gameBets: {
			groupStage: { winnerSide: 0, result: 0 },
			knockout: { winnerSide: 0, result: 0, qualifier: 0 },
			bonuses: {},
		},
		groupRankBets: { perfect: 0, minorMistake: 0 },
		specialBets: {},
		specialQuestionFlags: {} as SpecialQuestionFlagConfig,
	}
}

export function isTournamentLive(tournament: Tournament){
	// TODO: keep tournament live for 7 days (mas o menos) after finished
	return tournament.competition.status !== CompetitionStatus.Done
}

export function isTournamentDone(tournament: Tournament){
	return tournament.competition.status === CompetitionStatus.Done
}