import { MatchBetWithRelations } from "@/types"
import { MatchResultProps } from "./types"

export function betToMatchResultProps(bet: MatchBetWithRelations): MatchResultProps {
    return {
        home: {
            team: bet.relatedMatch.home_team,
            score: bet.result_home,
        },
        away: {
            team: bet.relatedMatch.away_team,
            score: bet.result_away,
        },
        isKnockout: bet.relatedMatch.is_knockout,
        qualifier: bet.winner_side,
        isTwoLeggedTie: bet.relatedMatch.isTwoLeggedTie,
    }
}