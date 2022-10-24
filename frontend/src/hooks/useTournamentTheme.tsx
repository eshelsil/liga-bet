import { useSelector } from 'react-redux';
import { ChosenTournamentIndex } from '../_selectors/logic';


export function useTournamentThemeClass() {
    const tournamentIndex = useSelector(ChosenTournamentIndex);
    return `tournament-theme tournament-theme-${tournamentIndex + 1}`;
}