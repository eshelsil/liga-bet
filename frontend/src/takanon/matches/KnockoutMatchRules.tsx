import React from 'react';
import { GameBetBonusesScoreConfig, GameBetScoreConfig, Team, WinnerSide } from '../../types';
import GameBetExamples from './GameBetExamples';
import GameBetScore from './GameBetScore';


interface Props {
    scoreConfig: GameBetScoreConfig
    bonuses: GameBetBonusesScoreConfig
    homeTeam: Team
    awayTeam: Team
    gamesCount: number
}

function KnockoutMatchRules({
    scoreConfig,
    bonuses,
    homeTeam,
    awayTeam,
    gamesCount,
}: Props) {
    return (
        <>
            <div className="takanonTextSection">
                <h4>שלב הנוקאאוט – {gamesCount} משחקים</h4>
                <GameBetScore
                    scoreConfig={scoreConfig}
                    gamesCount={gamesCount}
                    bonuses={bonuses}
                    isKo
                />
                {awayTeam && homeTeam && (
                    <GameBetExamples
                        scoresConfig={scoreConfig}
                        examples={[
                            {
                                bet: [1, 2],
                                game: {
                                    fullTime: [1, 1],
                                    extraTime: [1, 2],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                            {
                                bet: [1, 1],
                                qualifier: WinnerSide.Home,
                                game: {
                                    fullTime: [1, 1],
                                    extraTime: [1, 2],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                            {
                                bet: [1, 1],
                                qualifier: WinnerSide.Home,
                                game: {
                                    fullTime: [1, 1],
                                    extraTime: [2, 2],
                                    penalties: [5, 3],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                            {
                                bet: [1, 0],
                                game: {
                                    fullTime: [4, 3],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                            {
                                bet: [1, 0],
                                game: {
                                    fullTime: [1, 0],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                            {
                                bet: [1, 0],
                                game: {
                                    fullTime: [1, 1],
                                    extraTime: [2, 2],
                                    penalties: [3, 5],
                                    awayTeam,
                                    homeTeam,
                                    isKnockout: true,
                                },
                            },
                        ]}
                    />
                )}
            </div>
        </>
    )
}

export default KnockoutMatchRules
