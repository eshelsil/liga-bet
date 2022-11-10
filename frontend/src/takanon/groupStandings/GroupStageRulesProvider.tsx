import React from 'react';
import { useSelector } from 'react-redux';
import { GroupRankBetScoreConfig } from '../../types';
import { FormattedGroupRankScoreConfig, GroupsWithTeams } from '../../_selectors';
import GroupStageRulesView from './GroupStageRulesView';


interface Props {
    config?: GroupRankBetScoreConfig,
}

function GroupStageRules({
    config,
}: Props) {
    const currentScoreConfig = useSelector(FormattedGroupRankScoreConfig)
    const groupsById = useSelector(GroupsWithTeams);
    const groups = Object.values(groupsById);
    const exampleGroup = groups[0];
    const groupsCount = groups.length;
    const scoreConfig = config ?? currentScoreConfig
    return (<>
        {exampleGroup && (
            <GroupStageRulesView
                scoreConfig={scoreConfig}
                groupsCount={groupsCount}
                exampleGroup={exampleGroup}
            />
        )}
    </>);
};

export default GroupStageRules;