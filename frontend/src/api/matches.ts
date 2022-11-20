import { GameGoalsData, MatchApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'



type MatchApiResult = MatchApiModel[]

export const fetchMatches = async (
    tournamentId: number
): Promise<MatchApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/games`,
    })
}

export const updateScoresFromApi = async () => {
    ;(window as any).$.ajax({
        type: 'GET',
        url: '/api-fetch-games',
        success: function (server_msg) {
            const server_success_divider = 'SERVER_SUCCESS_MSG:'
            const msg = server_msg.split(server_success_divider)[1]
            ;(window as any).toastr['success'](msg)
        },
        error: function (error) {
            console.log('error', error)
            const error_text = error.responseText
            const server_error_divider = 'SERVER_ERROR_MSG:'
            if (error_text.indexOf(server_error_divider) > -1) {
                const error_msg = error_text.split(server_error_divider)[1]
                ;(window as any).toastr['error'](error_msg)
            } else {
                ;(window as any).toastr['error'](error_text)
            }
        },
    })
}


export const fetchGamesGoalsData = async (
    tournamentId: number
): Promise<GameGoalsData[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/goals`,
    })
}
