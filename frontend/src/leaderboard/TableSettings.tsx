import React, { ReactNode, useEffect, useState } from 'react'
import { Collapse, IconButton, Switch } from '@mui/material';
import StickyConfigView from '../widgets/stickyConfig/StickyConfigView';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LeaderboardVersionInput from './LeaderboardVersionInput';
import { useSelector } from 'react-redux';
import { LeaderboardVersionsWithGames } from '../_selectors';
import { keyBy, last, pickBy } from 'lodash';
import { ScoreboardConfig, UpdateSettingFunc } from '../_reducers/scoreboardSettings';
import './TableSettings.scss';



interface Props {
    hasLiveGames: boolean
    settings: ScoreboardConfig
    updateSetting: UpdateSettingFunc
    fetchScoreboards: () => void
}

interface ConfigRowProps {
    disabled?: boolean
    input?: ReactNode
    children: ReactNode
}
function ConfigRow({ children }: ConfigRowProps) {

    return (
        <div className={`TableSettings-configRow`}>
            {children}
        </div>
    )
}

function TableSettings({ updateSetting, settings, hasLiveGames, fetchScoreboards }: Props) {
    const versionsOrdered = useSelector(LeaderboardVersionsWithGames)
    const versionsById = keyBy(versionsOrdered, 'id')
    const hasVersions = versionsOrdered.length > 0
    const firstVersion = last(versionsOrdered)

    const {liveMode, upToDateMode, showChange, originVersion, destinationVersion, expanded} = settings;
    const [pinned, setPinned] = useState(false)
    const toggleExpand = () => updateSetting('expanded', !expanded)

    
    const isShowingHistoryTable = !upToDateMode && !liveMode
    const pastVersionsById = (destinationVersion && !upToDateMode)
        ? pickBy(versionsById, v => v.order < destinationVersion.order)
        : keyBy(versionsOrdered.slice(1), 'id')

    const isShowingFirstVersion = !upToDateMode && destinationVersion?.order === firstVersion?.order

    const toggleLiveMode = () => updateSetting('liveMode', !liveMode)
    const togglUpToDateMode = () => updateSetting('upToDateMode', !upToDateMode)
    const togglShowChange = () => updateSetting('showChange', !showChange)
    const onDestVersionChange = (id: number) => updateSetting('destinationVersion', versionsById[id])
    const onOriginVersionChange = (id: number) => updateSetting('originVersion', versionsById[id])

    const showSettings = hasVersions || hasLiveGames

    useEffect(() => {
        if (!expanded && (liveMode || !upToDateMode || showChange)){
            toggleExpand()
        }
    }, [])

    useEffect(() => {
        if (!hasLiveGames && liveMode){
            toggleLiveMode()
        }
    }, [hasLiveGames, liveMode])


    return (
        showSettings && (
            <StickyConfigView
                setPinned={setPinned}
                pinned={pinned}
                className='LB-TableSettings'
                header={
                    <div className='TableSettings-header' onClick={toggleExpand}>
                        <div className='TableSettings-title'>
                            הגדרות טבלה
                        </div>
                        <IconButton onClick={toggleExpand}>
                            <ArrowDownIcon className={`TableSettings-expandArrow ${expanded ? 'TableSettings-expanded' : ''}`} />
                        </IconButton>
                    </div>
                }
            >
                <Collapse in={expanded}>
                    <div>
                        {hasLiveGames && (
                            <ConfigRow>
                                <div className='TableSettings-flexRow'>
                                    <Switch
                                        color="primary"
                                        checked={liveMode}
                                        onClick={toggleLiveMode}
                                    />
                                    <div className='TableSettings-label'>
                                        מצב חי (live)
                                    </div>
                                </div>
                            </ConfigRow>
                        )}
                        {hasVersions && (<>
                            <ConfigRow>
                                <div className='TableSettings-flexRow TableSettings-destVersionRow'>
                                    <div className={`TableSettings-label ${!isShowingHistoryTable ? 'TableSettings-bolded' : ''}`}>
                                        טבלה עדכנית
                                    </div>
                                    <Switch
                                        color="primary"
                                        checked={!upToDateMode}
                                        onClick={togglUpToDateMode}
                                        disabled={liveMode}
                                    />
                                    <div className={`TableSettings-label ${isShowingHistoryTable ? 'TableSettings-bolded' : ''}`}>
                                        מצב היסטורי
                                    </div>
                                </div>
                                <Collapse in={!upToDateMode} timeout={{enter: 300, exit: 50}}>
                                    <LeaderboardVersionInput
                                        versionsById={versionsById}
                                        value={destinationVersion?.id}
                                        onChange={onDestVersionChange}
                                        retryFetch={fetchScoreboards}
                                        label='שלב סופי'
                                        disabled={liveMode || upToDateMode}
                                    />
                                </Collapse>
                            </ConfigRow>
                            {!isShowingFirstVersion && (
                                <ConfigRow>
                                    <div className='TableSettings-flexRow'>
                                        <Switch
                                            color="primary"
                                            checked={showChange}
                                            onClick={togglShowChange}
                                            disabled={liveMode}
                                        />
                                        <div className='TableSettings-label'>
                                            הצג התקדמות
                                        </div>
                                    </div>
                                    <Collapse in={showChange} timeout={{enter: 300, exit: 50}}>
                                        <LeaderboardVersionInput
                                            versionsById={pastVersionsById}
                                            value={originVersion?.id}
                                            onChange={onOriginVersionChange}
                                            retryFetch={fetchScoreboards}
                                            label='שלב התחלתי'
                                            disabled={liveMode || !showChange}
                                        />
                                    </Collapse>
                                </ConfigRow>
                            )}
                        </>)}
                    </div>
                </Collapse>
            </StickyConfigView>
        )
    )
}

export default TableSettings
