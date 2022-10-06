import { WinnerSide } from "../types";


export function getWinnerSide(homeScore: number, awayScore: number){
    if (homeScore > awayScore){
        return WinnerSide.Home;
    }
    if (homeScore < awayScore){
        return WinnerSide.Away;
    }
    return null;
}