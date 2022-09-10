import { MyUtlsById, UtlWithTournament, User } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export const getUsers = async (): Promise<User[]> => {
    return await sendApiRequest({
        url: '/api/users'
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