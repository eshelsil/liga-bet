import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameBetScoreConfig, Team } from '../../types';
import GameBetExamples from './GameBetExamples';
import GameBetScore from './GameBetScore';


interface Props {
    scoreConfig: GameBetScoreConfig
    homeTeam: Team
    awayTeam: Team
    gamesCount: number
}

function GroupStageMatchRules({
    scoreConfig,
    homeTeam,
    awayTeam,
    gamesCount,
}: Props) {
    const { t } = useTranslation('takanon')
    return (
        <>
            <div className="takanonTextSection">
                <h4>{t('matches.groupStageTitle', { count: gamesCount })}</h4>
                <GameBetScore
                    gamesCount={gamesCount}
                    scoreConfig={scoreConfig}
                />
                {awayTeam && homeTeam && (
                    <GameBetExamples
                        scoresConfig={scoreConfig}
                        examples={[
                            {
                                bet: [2, 3],
                                game: {
                                    fullTime: [2, 3],
                                    awayTeam,
                                    homeTeam,
                                },
                            },
                            {
                                bet: [2, 3],
                                game: {
                                    fullTime: [0, 2],
                                    awayTeam,
                                    homeTeam,
                                },
                            },
                            {
                                bet: [2, 3],
                                game: {
                                    fullTime: [2, 2],
                                    awayTeam,
                                    homeTeam,
                                },
                            },
                        ]}
                    />
                )}
            </div>
        </>
    )
}

export default GroupStageMatchRules
