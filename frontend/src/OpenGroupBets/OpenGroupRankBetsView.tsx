import React, { useState } from 'react'
import { GroupWithABet } from '../types'
import { Grid } from '@mui/material'
import GroupRankBetView from './GroupRankBetView'
import './openGroupRankBets.scss'


interface Props {
    groupsWithBet: GroupWithABet[]
    sendGroupRankBet: (...args: any) => Promise<void>
}

const OpenGroupRankBetsView = ({ groupsWithBet, sendGroupRankBet }: Props) => {
    const isAvaiable = true
    return (
        <>
            {isAvaiable && (
                <div className='LB-OpenGroupRankBetsView'>
                    <h2>הימורי בתים פתוחים</h2>
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
            {!isAvaiable && (
                <h2>נסגרו הימורי הבתים! לא ניתן לעדכן הימורים אלה</h2>
            )}
        </>
    )
}

export default OpenGroupRankBetsView
