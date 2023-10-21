import { mapValues, zipObject } from "lodash";
import { calcLeaderboardDiff, generateEmptyScoreboardRow, valuesOf } from "../../utils";
import { LeaderboardVersionWithGame, ScoreboardRow, ScoreboardRowDetailed, ScoreboardRowsByVersionId, UTLsById } from "../../types";


export function getAxes(max: number): number[]{
	if (max <= 25){
		return [10, 25]
	}
	if (max <= 50){
		return [25, 50]
	}
	const digitsCount = `${max}`.length
	let jump: number;
	let axesCount: number;
	const first2Digits = Number(`${max}`.slice(0,2))
	if (first2Digits < 20){
		jump = 10 ** (digitsCount - 2) * 5
		axesCount = 4
	} else if (first2Digits < 50){
		jump = 10 ** (digitsCount - 2) * 10
		axesCount = 5
	} else {
		jump = 10 ** (digitsCount - 2) * 25
		axesCount = 4
	}
	const axis = []
	for (let i = 1; i <= axesCount; i++){
		axis.push(jump * i)
	}
	return axis
}


export function getUserColors({hslMax, hslMin, utlIds}:{hslMax: number, hslMin: number, utlIds: number[]}): Record<number, string>{
	const hslRange = hslMax - hslMin
    const colorDiff = Math.max(hslRange / utlIds.length, 10)

	const colors = valuesOf(utlIds).map((utlId, index) => `hsla(${Math.floor(hslMin + (colorDiff * index) % hslRange)}, 60%, 60%, 90%)`)
  	return zipObject(utlIds, colors)
}


export function getHeightByUtlId(sortedScoreboard: ScoreboardRow[]){
	const heightByUtlId: Record<number, number> = {}
	let lastRank = -1
	let equalRanksCount = 0
	for(const [index, row] of sortedScoreboard.entries()) {
		if (lastRank === row.rank){
			equalRanksCount++
		}
		heightByUtlId[row.user_tournament_id] = index * 36 - (equalRanksCount * 12)
		lastRank = row.rank
	}
	return heightByUtlId
}


export function calcScoreboardRows({scoreboardsByVersionId, versions, utls, currentIndex, prevIndex}:{
	scoreboardsByVersionId: ScoreboardRowsByVersionId
	versions: LeaderboardVersionWithGame[]
	utls: UTLsById
	currentIndex: number
	prevIndex: number
}): ScoreboardRowDetailed[]{
	const versionsCount = versions.length
	const getScoreboardRowsByUtlId = (index: number) => {
		if (index < 0 || index > versionsCount - 1 ){
			return mapValues(utls, generateEmptyScoreboardRow)
		}
		const version = versions[index]
		return scoreboardsByVersionId[version.id] ?? {}
	}
	const currentLeaderboard = getScoreboardRowsByUtlId(currentIndex)
	const prevLeaderboard = getScoreboardRowsByUtlId(prevIndex)
	const scoreboardRows = valuesOf(calcLeaderboardDiff(currentLeaderboard, prevLeaderboard))
	return scoreboardRows
}