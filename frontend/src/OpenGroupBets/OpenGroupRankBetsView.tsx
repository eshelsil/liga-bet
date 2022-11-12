import React from 'react'
import { GroupWithABet } from '../types'
import { Grid } from '@mui/material'
import GroupRankBetView from './GroupRankBetView'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import GroupStageRules from '../takanon/groupStandings/GroupStageRulesProvider'
import dayjs from 'dayjs'
import { DEFAULT_DATETIME_FORMAT } from '../utils'
import './openGroupRankBets.scss'
import '../styles/openBets/EditableBetView.scss'


interface Props {
    groupsWithBet: GroupWithABet[]
    competitionStartTime: Date
    sendGroupRankBet: (...args: any) => Promise<void>
    isAvailable: boolean
}

const OpenGroupRankBetsView = ({ groupsWithBet, sendGroupRankBet, competitionStartTime, isAvailable }: Props) => {
    const startTimeString = competitionStartTime ? `(${dayjs(competitionStartTime).format(DEFAULT_DATETIME_FORMAT)})` : ''
    return (
        <>
            {isAvailable && (
                <div className='LB-OpenGroupRankBetsView'>
                    <h2>ניחוש דירוגי בתים</h2>
                    <ul>
                        <li>ניתן לערוך את הניחושים עד שעת תתחילת המשחק הראשון בטורניר {' '}{startTimeString}</li>
                        <li style={{marginTop: 8}}>
                            ניתן לראות את שיטת הניקוד
                            <TakanonPreviewModal label={'בלחיצה כאן'}>
                                <GroupStageRules />
                            </TakanonPreviewModal>
                        </li>
                    </ul>
                    <Grid container>
                        {groupsWithBet.map((groupWithBet) => (
                            <GroupRankBetView
                                key={groupWithBet.id}
                                groupWithBet={groupWithBet}
                                sendGroupRankBet={sendGroupRankBet}
                            />
                        ))}
                    </Grid>
                </div>
            )}
            {!isAvailable && (
                <h2>נסגרו הימורי הבתים! לא ניתן לעדכן הימורים אלה</h2>
            )}
        </>
    )
}

export default OpenGroupRankBetsView
