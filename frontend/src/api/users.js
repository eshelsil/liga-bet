import { sendApiRequest } from "./common/apiRequest";

export const getUser = async () => {
    return await sendApiRequest({
        url: '/user'
    })
}

const sendRequest = async () => {
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