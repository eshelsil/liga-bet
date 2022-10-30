import { orderBy } from 'lodash';
import { LeaderboardVersionById } from '../types';
import { valuesOf } from './common';

export function sortLeaderboardVersions(versions: LeaderboardVersionById) {
    return orderBy(valuesOf(versions), 'created_at', 'desc')
}

export function getScoreOfUtl(versions: LeaderboardVersionById, utlId: number) {
    const sortedVersions = sortLeaderboardVersions(versions)
    const currentVersion = sortedVersions[0]
    if (!currentVersion){
        return undefined
    }
    const currentVersionRow = currentVersion[utlId]
    if (!currentVersionRow){
        return undefined
    }
    const prevVersion = sortedVersions[1]
    const prevVersionRow = prevVersion ? prevVersion[utlId] : undefined
    const {rank, score} = currentVersionRow
    const {rank: prevRank, score: prevScore} = prevVersionRow || {}
    return {
        ...currentVersionRow,
        addedScore: score - (prevScore ?? 0),
        change: prevRank ? prevRank - rank : 0,
    }

}