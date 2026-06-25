import { BracketGame } from '../types'
import { sendApiRequest } from './common/apiRequest'

/**
 * GET /api/tournaments/{tournamentId}/bracket — the knockout bracket as a flat
 * list of ties (contract D). Returns [] for non-bracket competitions. The FE
 * groups by `round` + `side` to render the tree.
 */
export const fetchBracket = async (tournamentId: number): Promise<BracketGame[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bracket`,
    })
}
