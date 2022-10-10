import { Group } from '../types/group'
import { isDevModeTamir } from '../_helpers/dev'

const EXAMPLE_DATA = {
    1: {
        name: 'Group A',
        id: 1,
        isDone: true,
        standings: [10, 9, 11, 12],
    },
    2: {
        name: 'Group B',
        id: 2,
        isDone: true,
        standings: [7, 8, 6, 5],
    },
}

const fakeAPI = async () => {
    return EXAMPLE_DATA
}

type GroupsApiResult = Record<number, Group>

export const fetchGroups = async (
    tournamentId: number
): Promise<GroupsApiResult> => {
    if (isDevModeTamir()) return await fakeAPI()
    return await (window as any).$.ajax({
        type: 'GET',
        url: `/api/tournaments/${tournamentId}/groups`,
        contentType: 'application/json',
        dataType: 'json',
    })
}
