import React from 'react';
import { GroupRankBetScoreConfig, GroupWithTeams } from '../../types';
import ExamplesAccordion from '../ExamplesAccordion';
import GroupRankExamplesTable from './GroupRankExamplesTable';


interface Props {
    scoreConfig: GroupRankBetScoreConfig,
    exampleGroup: GroupWithTeams,
    groupsCount: number,
}

function GroupStageRulesView({
    scoreConfig,
    exampleGroup,
    groupsCount,
}: Props) {
    const { perfect, minorMistake } = scoreConfig
    const maxScore = groupsCount * Number(perfect)
    
    return (
        <div className="LB-GroupStageRulesView takanonTextSection">
            <h4>דירוג בתים</h4>
            <table className='scoresConfigTable'>
                <thead>
                    <tr>
                        <th></th>
                        <th>ניקוד</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='scoreRuleLabel'>סידור מושלם</td>
                        <td>{perfect}</td>
                    </tr>
                    <tr>
                        <td className='scoreRuleLabel'>טעות מינימלית</td>
                        <td>{minorMistake}</td>
                    </tr>
                </tbody>
            </table>
            <h5>מקסימום נקודות - {maxScore}</h5>
            <ul style={{ marginTop: 8 }}>
                <li>
                    <b>פגיעה מושלמת</b> = דירוג מקומות 1-4 בבית לפי הסדר המדויק בו סיימו את שלב הבתים
                </li>
                <li>
                    <b>טעות מינימלית</b> = היפוך בין מקומות צמודים (טעות אחת בין מקומות 1,2 או 2,3 או 3,4)
                </li>
            </ul>
            
            {exampleGroup && (
                <ExamplesAccordion>
                    <GroupRankExamplesTable
                        scoreConfig={scoreConfig}
                        exampleGroup={exampleGroup}
                    />
                </ExamplesAccordion>
            )}
        </div>
    )
}

export default GroupStageRulesView;
