import { MyUtlsById, UtlWithTournament, User, UserPermissions } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export interface GetUsersParams{
    search?: string,
    roles?: UserPermissions[],
  }

export const getUsers = async ({roles, ...restParams}: GetUsersParams): Promise<User[]> => {

    const searchParams = new URLSearchParams({
        ...restParams,
    });
    for (const role of roles ?? []){
        searchParams.append('roles[]', `${role}`);
    }
    const search = searchParams.toString();
    return await sendApiRequest({
        url: `/api/users?${search}`,
    })
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