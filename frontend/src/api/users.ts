import { User, UserRole, UTL, UtlRole } from "../types";
import { isDevModeTamir } from "../_helpers/dev";
import { sendApiRequest } from "./common/apiRequest";

const EXAMPLE_DATA_GET_USER = {
    created_at: "2022-07-20T13:02:11.000000Z",
    fcm_token: null,
    id: 1,
    name: "eshel",
    role: UserRole.Admin,
    updated_at: "2022-07-20T13:02:11.000000Z",
    username: "eshel",
}

const EXAMPLE_DATA_GET_UTLS = [
    {
        "id": 20,
        "user_id": 1,
        "tournament_id": 1,
        "role": UtlRole.Admin,
    },
];



export const getUser = async (): Promise<User> => {
    if (isDevModeTamir()) return EXAMPLE_DATA_GET_USER;
    return await sendApiRequest({
        url: '/user'
    })
}


export const getUserUTLs = async (): Promise<UTL[]> => {
    if (isDevModeTamir()) return EXAMPLE_DATA_GET_UTLS;
    return await sendApiRequest({
        url: '/tournament-user'
    })
}

type UtlsApiResponse = Record<number, UTL>

const sendRequest = async (): Promise<UtlsApiResponse> => {
    return {
        20: {
            id: 20,
            name: "Eliyahu Hanavim",
        },
        18: {
            id: 18,
            name: "Avi Siman Savir",
        },
        3: {
            id: 3,
            name: "Moshe Zion Shlush",
        },
        7: {
            id: 7,
            name: "Edgar Bat-Sheshet",
        },
        23: {
            id: 23,
            name: "Simha Riff Cohen",
        },
        1: {
            id: 1,
            name: "Isam Tuka",
        },
        4: {
            id: 4,
            name: "Niv Dalpa Sivi",
        },
        26: {
            id: 26,
            name: "Yaniv Catan",
        },
    };
}
export const fetchUsers = sendRequest;