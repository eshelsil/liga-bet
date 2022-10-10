import React from 'react'
import { GroupWithTeams } from '../types'
import TeamAndSymbol from '../widgets/TeamWithFlag'

interface GroupRankScoreConfig {
    perfect: number
    minorMistake: number
}

interface Props {
    scoreConfig: GroupRankScoreConfig
    groupsCount: number
    exampleGroup: GroupWithTeams
}

function GroupStageRules({
    scoreConfig: { perfect, minorMistake },
    groupsCount,
    exampleGroup,
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
                                1. <TeamAndSymbol {...teamA} />
                            </div>
                            <div>
                                2. <TeamAndSymbol {...teamB} />
                            </div>
                            <div>
                                3. <TeamAndSymbol {...teamC} />
                            </div>
                            <div>
                                4. <TeamAndSymbol {...teamD} />
                            </div>
                        </td>
                        <td className="groupRank">
                            <div>
                                1. <TeamAndSymbol {...teamA} />
                            </div>
                            <div>
                                2. <TeamAndSymbol {...teamB} />
                            </div>
                            <div>
                                3. <TeamAndSymbol {...teamC} />
                            </div>
                            <div>
                                4. <TeamAndSymbol {...teamD} />
                            </div>
                        </td>
                        <td>{perfect}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="groupRank">
                            <div>
                                1. <TeamAndSymbol {...teamA} />
                            </div>
                            <div>
                                2. <TeamAndSymbol {...teamC} />
                            </div>
                            <div>
                                3. <TeamAndSymbol {...teamB} />
                            </div>
                            <div>
                                4. <TeamAndSymbol {...teamD} />
                            </div>
                        </td>
                        <td>{minorMistake}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="groupRank">
                            <div>
                                1. <TeamAndSymbol {...teamC} />
                            </div>
                            <div>
                                2. <TeamAndSymbol {...teamA} />
                            </div>
                            <div>
                                3. <TeamAndSymbol {...teamB} />
                            </div>
                            <div>
                                4. <TeamAndSymbol {...teamD} />
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

export default GroupStageRules
