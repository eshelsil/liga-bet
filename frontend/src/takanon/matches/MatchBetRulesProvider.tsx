import React from 'react';
import { useSelector } from 'react-redux';
import { MatchBetsScoreConfig } from '../../types';
import { FormattedMatchBetScoreConfig, GroupStageGamesCount, KoGamesCount, Teams } from '../../_selectors';
import MatchBetRulesView from './MatchBetRulesView';


interface Props {
    config?: MatchBetsScoreConfig,
}

function MatchBetRules({
    config,
}: Props) {
    const teamsById = useSelector(Teams);
    const groupStageGamesCount = useSelector(GroupStageGamesCount);
    const currentScoreConfig = useSelector(FormattedMatchBetScoreConfig);
    const knockoutGamesCount = useSelector(KoGamesCount);
    const scoreConfig = config ?? currentScoreConfig;


    const teams = Object.values(teamsById);
    const homeTeam = teams[0];
    const awayTeam = teams[1];
    return (<>
        {homeTeam && awayTeam && (
            <MatchBetRulesView
                {...{
                    scoreConfig,
                    homeTeam,
                    awayTeam,
                    knockoutGamesCount,
                    groupStageGamesCount,
                }}
            />
        )}
    </>);
};

export default MatchBetRules;