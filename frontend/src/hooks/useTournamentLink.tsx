import { useSelector } from 'react-redux';
import { CurrentTournament } from '../_selectors';


export function useTournamentLink(code?: string) {
    const tournament = useSelector(CurrentTournament);
    const tounamentCode = code ?? tournament?.code
    if (!tounamentCode) {
        return null
    }
    const port = (!window.location.port || window.location.port === '80') ? '' : `:${window.location.port}`
    return `${window.location.protocol}//${window.location.hostname}${port}/join-tournament/${tounamentCode}`
}