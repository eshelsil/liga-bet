import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('takanon')
    const { perfect, minorMistake } = scoreConfig
    const maxScore = groupsCount * Number(perfect)

    return (
        <div className="LB-GroupStageRulesView takanonTextSection">
            <h4>{t('groupStandings.heading')}</h4>
            <table className='scoresConfigTable'>
                <thead>
                    <tr>
                        <th></th>
                        <th>{t('groupStandings.scoreHeader')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='scoreRuleLabel'>{t('groupStandings.perfectLabel')}</td>
                        <td>{perfect}</td>
                    </tr>
                    <tr>
                        <td className='scoreRuleLabel'>{t('groupStandings.minorMistakeLabel')}</td>
                        <td>{minorMistake}</td>
                    </tr>
                </tbody>
            </table>
            <h5>{t('groupStandings.maxScore', { score: maxScore })}</h5>
            <ul style={{ marginTop: 8 }}>
                <li>
                    <b>{t('groupStandings.perfectExplanation')}</b>{t('groupStandings.perfectExplanationText')}
                </li>
                <li>
                    <b>{t('groupStandings.minorMistakeExplanation')}</b>{t('groupStandings.minorMistakeExplanationText')}
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
