import React from 'react';
import { Team, WinnerSide } from '../../types';
import { GameBetScoreConfig } from './types';
import GameBetExamples from './GameBetExamples';
import GameBetScore from './GameBetScore';


interface Props {
    scoreConfig: GameBetScoreConfig,
    homeTeam: Team,
    awayTeam: Team,
    gamesCount: number,
}

function KnockoutMatchRules({
    scoreConfig,
    homeTeam,
    awayTeam,
    gamesCount,
}: Props) {
    return (<>
        <div className="text-part">
            <h4>שלב הנוקאאוט – {gamesCount} משחקים</h4>
            <GameBetScore
                scoreConfig={scoreConfig}
                gamesCount={gamesCount}
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
                        },
                    },
                    {
                        bet: [1, 0],
                        game: {
                            fullTime: [4, 3],
                            awayTeam,
                            homeTeam,
                        },
                    },
                    {
                        bet: [1, 0],
                        game: {
                            fullTime: [1, 0],
                            awayTeam,
                            homeTeam,
                        },
                    },
                ]}
            />
        )}
    </div>
    </>);
};

export default KnockoutMatchRules;