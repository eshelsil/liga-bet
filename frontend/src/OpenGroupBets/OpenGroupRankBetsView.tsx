import React from 'react'
import { useTranslation } from 'react-i18next'
import { GroupWithABet } from '../types'
import { Grid } from '@mui/material'
import GroupRankBetView from './GroupRankBetView'
import TakanonPreviewModal from '../tournamentConfig/takanonPreview/TakanonPreviewModal'
import GroupStageRules from '../takanon/groupStandings/GroupStageRulesProvider'
import dayjs from 'dayjs'
import { DEFAULT_DATETIME_FORMAT } from '../utils'
import './openGroupRankBets.scss'
import '../styles/openBets/EditableBetView.scss'
import { useSelector } from 'react-redux'
import { MyOtherBettableUTLs } from '../_selectors'
import MultiBetsSettings from '../multiBetsSettings/MultiBetsSettingsProvider'


interface Props {
    groupsWithBet: GroupWithABet[]
    competitionStartTime: Date
    sendGroupRankBet: (...args: any) => Promise<void>
    isAvailable: boolean
}

const OpenGroupRankBetsView = ({ groupsWithBet, sendGroupRankBet, competitionStartTime, isAvailable }: Props) => {
    const { t } = useTranslation('OpenGroupBets')
    const startTimeString = competitionStartTime ? `(${dayjs(competitionStartTime).format(DEFAULT_DATETIME_FORMAT)})` : ''
    const otherTournaments = useSelector(MyOtherBettableUTLs);
    const hasOtherTournaments = otherTournaments.length > 0;
    return (
        <>
            {isAvailable && (
                <div className='LB-OpenGroupRankBetsView'>
                    <h2 className='LB-TitleText'>{t('view.title')}</h2>
                    <div className='LB-FloatingFrame'>
                        <ul style={{margin: 0}}>
                            <li>{t('view.editUntil', { startTime: startTimeString })}</li>
                            <li style={{marginTop: 8}}>
                                {t('view.scoringMethodPrefix')}
                                <TakanonPreviewModal label={t('view.scoringMethodLink')}>
                                    <GroupStageRules />
                                </TakanonPreviewModal>
                            </li>
                        </ul>
                    </div>
                    {hasOtherTournaments && (
                        <MultiBetsSettings />
                    )}
                    <Grid container justifyContent="center">
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
                <h2 className='LB-TitleText'>{t('view.closedTitle')}</h2>
            )}
        </>
    )
}

export default OpenGroupRankBetsView
