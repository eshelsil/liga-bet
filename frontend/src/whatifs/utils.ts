import { keysOf } from "@/utils"
import { union } from "lodash"

export const eventToNumber = (e: any) => {
    const value = parseInt(e.target.value)
    return isNaN(value) ? 0 : value
}

export const getPlayersData = (
    {scorersData, assistsData}: {
    assistsData?: Record<number, number>,
    scorersData?: Record<number, number>
}) => {
    const res = {} as Record<number, {goals: number, assists: number}>
    for (const playerId of union(keysOf(assistsData), keysOf(scorersData))){
        const goals = scorersData[playerId]
        const assists = assistsData[playerId]
        res[playerId] = {goals: goals ?? 0, assists: assists ?? 0}
    }
    return res
}
