import React from 'react';
import { useSelector } from 'react-redux';
import { MatchBetsScoreConfig } from '../../types';
import { GroupStageGamesCount, Teams } from '../../_selectors';
import MatchBetRulesView from './MatchBetRulesView';


interface Props {
    scoreConfig: MatchBetsScoreConfig,
}

function MatchBetRules({
    scoreConfig,
}: Props) {
    const teamsById = useSelector(Teams);
    const groupStageGamesCount = useSelector(GroupStageGamesCount);
    const knockoutGamesCount = 16;


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