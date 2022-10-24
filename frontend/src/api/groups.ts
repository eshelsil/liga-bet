import { Group } from '../types/group'

type GroupsApiResult = Record<number, Group>

export const fetchGroups = async (
    tournamentId: number
): Promise<GroupsApiResult> => {
    return await (window as any).$.ajax({
        type: 'GET',
        url: `/api/tournaments/${tournamentId}/groups`,
        contentType: 'application/json',
        dataType: 'json',
    })
}
