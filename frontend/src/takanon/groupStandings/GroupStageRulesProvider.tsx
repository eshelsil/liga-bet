import React from 'react';
import { useSelector } from 'react-redux';
import { GroupRankBetScoreConfig } from '../../types';
import { GroupsWithTeams } from '../../_selectors';
import GroupStageRulesView from './GroupStageRulesView';


interface Props {
    scoreConfig: GroupRankBetScoreConfig,
}

function GroupStageRules({
    scoreConfig,
}: Props) {
    const groupsById = useSelector(GroupsWithTeams);
    const groups = Object.values(groupsById);
    const exampleGroup = groups[0];
    const groupsCount = groups.length;
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