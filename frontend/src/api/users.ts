import { MyUtlsById, UtlWithTournament, User, UserPermissions } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export interface GetUsersParams{
    offset?: string,
    limit?: string,
    search?: string,
    roles?: UserPermissions[],
  }

export const getUsers = async ({roles, ...restParams}: GetUsersParams): Promise<{users: User[], totalCount: number}> => {

    const searchParams = new URLSearchParams({
        ...restParams,
    });
    for (const role of roles ?? []){
        searchParams.append('roles[]', `${role}`);
    }
    const search = searchParams.toString();
    const {data: users, headers } = await sendApiRequest({
        url: `/api/users?${search}`,
        includeResponseHeaders: ['X-Total-Count'],
    });
    return {users, totalCount: Number(headers['X-Total-Count'])};
}

export const updateUser = async (userId: number, data: Partial<User>): Promise<User> => {
    return await sendApiRequest({
        url: `/api/users/${userId}`,
        type: 'PUT',
        data,
    })
}

export const getUserUTLs = async (): Promise<MyUtlsById> => {
    return await sendApiRequest({
        url: '/api/user/utls'
    })
}

export const joinTournament = async ({
    code,
    name,
}: {
    code: string,
    name: string,
}): Promise<UtlWithTournament> => {
    return await sendApiRequest({
        url: '/api/user/utls',
        type: 'POST',
        data: {code, name},
    })
}

export const leaveTournament = async (tournamentId: number): Promise<null> => {
    return await sendApiRequest({
        url: `/api/user/utls/${tournamentId}`,
        type: 'DELETE',
    })
}