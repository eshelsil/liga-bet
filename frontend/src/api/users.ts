import { UtlRole, MyUtlsById, UTLsById } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export const getUserUTLs = async (): Promise<MyUtlsById> => {
    return await sendApiRequest({
        url: '/api/user/utls'
    })
}


const sendRequest = async (): Promise<UTLsById> => {
    return {
        20: {
            id: 20,
            name: "Eliyahu Hanavim",
            role: UtlRole.Admin,
            tournament_id: 1,
        },
        18: {
            id: 18,
            name: "Avi Siman Savir",
            role: UtlRole.Manager,
            tournament_id: 1,
        },
        3: {
            id: 3,
            name: "Moshe Zion Shlush",
            role: UtlRole.Manager,
            tournament_id: 1,
        },
        7: {
            id: 7,
            name: "Edgar Bat-Sheshet",
            role: UtlRole.User,
            tournament_id: 1,
        },
        23: {
            id: 23,
            name: "Simha Riff Cohen",
            role: UtlRole.User,
            tournament_id: 1,
        },
        1: {
            id: 1,
            name: "Isam Tuka",
            role: UtlRole.User,
            tournament_id: 1,
        },
        4: {
            id: 4,
            name: "Niv Dalpa Sivi",
            role: UtlRole.User,
            tournament_id: 1,
        },
        26: {
            id: 26,
            name: "Yaniv Catan",
            role: UtlRole.User,
            tournament_id: 1,
        },
    };
}
export const fetchUsers = sendRequest;