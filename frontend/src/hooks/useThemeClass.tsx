import { useSelector } from 'react-redux';
import { PrizesSelector } from '../_selectors';
import { ChosenTournamentIndex } from '../_selectors/logic';


export function useTournamentThemeClass() {
    const tournamentIndex = useSelector(ChosenTournamentIndex);
    return `tournament-theme tournament-theme-${tournamentIndex + 1}`;
}

export function usePrizesThemeClass() {
    const prizes = useSelector(PrizesSelector)
    const prizesCount = prizes.length
    return (rank: number) => rank <= prizesCount ? `prize-theme prize-theme-${rank}` : '';
}