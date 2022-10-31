import React from 'react';
import { GroupRankBetScoreConfig, GroupWithTeams } from '../../types';
import TeamWithFlag from '../../widgets/TeamWithFlag';


interface Props {
    scoreConfig: GroupRankBetScoreConfig,
    exampleGroup: GroupWithTeams,
    groupsCount: number,
}

function GroupStageRulesView({
    scoreConfig: {
        perfect,
        minorMistake,
    },
    exampleGroup,
    groupsCount,
}: Props) {
    const maxScore = groupsCount * perfect
    const teamA = exampleGroup.teams[0]
    const teamB = exampleGroup.teams[1]
    const teamC = exampleGroup.teams[2]
    const teamD = exampleGroup.teams[3]
    return (
        <div className="text-part">
            <h4>דירוג בתים</h4>
            <table>
                <thead>
                    <tr>
                        <th>הימור</th>
                        <th>ניקוד</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bold">
                        <td>סידור מושלם</td>
                        <td>{perfect}</td>
                    </tr>
                    <tr className="bold">
                        <td>טעות מינימלית</td>
                        <td>{minorMistake}</td>
                    </tr>
                    <tr className="divide">
                        <td>מקסימום נקודות</td>
                        <td>{maxScore}</td>
                    </tr>
                </tbody>
            </table>
            <ul style={{ marginTop: 8 }}>
                <li>
                    טעות מינימלית = היפוך בין מקומות צמודים (טעות אחת בין מקומות
                    1,2 או 2,3 או 3,4)
                </li>
            </ul>
            <h5 className="underlined">דוגמאות</h5>
            <table>
                <thead>
                    <tr>
                        <th>הימור</th>
                        <th>תוצאה בפועל</th>
                        <th>ניקוד</th>
                        <th>הסבר</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={4} className="groupRank v-align-center">
                            <div>
                                1. <TeamWithFlag {...teamA} />
                            </div>
                            <div>
                                2. <TeamWithFlag {...teamB} />
                            </div>
                            <div>
                                3. <TeamWithFlag {...teamC} />
                            </div>
                            <div>
                                4. <TeamWithFlag {...teamD} />
                            </div>
                        </td>
                        <td className="groupRank">
                            <div>
                                1. <TeamWithFlag {...teamA} />
                            </div>
                            <div>
                                2. <TeamWithFlag {...teamB} />
                            </div>
                            <div>
                                3. <TeamWithFlag {...teamC} />
                            </div>
                            <div>
                                4. <TeamWithFlag {...teamD} />
                            </div>
                        </td>
                        <td>{perfect}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="groupRank">
                            <div>
                                1. <TeamWithFlag {...teamA} />
                            </div>
                            <div>
                                2. <TeamWithFlag {...teamC} />
                            </div>
                            <div>
                                3. <TeamWithFlag {...teamB} />
                            </div>
                            <div>
                                4. <TeamWithFlag {...teamD} />
                            </div>
                        </td>
                        <td>{minorMistake}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="groupRank">
                            <div>
                                1. <TeamWithFlag {...teamC} />
                            </div>
                            <div>
                                2. <TeamWithFlag {...teamA} />
                            </div>
                            <div>
                                3. <TeamWithFlag {...teamB} />
                            </div>
                            <div>
                                4. <TeamWithFlag {...teamD} />
                            </div>
                        </td>
                        <td>0</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default GroupStageRulesView;
