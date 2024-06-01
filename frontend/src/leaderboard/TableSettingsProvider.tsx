import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    IsWhatifOn,
    LiveGamesIds,
    NoSelector,
    ScoreboardSettings,
} from '../_selectors'
import { useSelector } from 'react-redux'
import {
    updateScoreboardSetting,
    resetScoreboardSettings,
} from '../_actions/scoreboardSettings'
import TableSettings from './TableSettings'
import { UpdateSettingFunc } from '../_reducers/scoreboardSettings'

interface Props {
    updateSetting: UpdateSettingFunc
    resetSettings: () => void
    fetchScoreboards: () => void
}

function TableSettingsProvider({
    updateSetting,
    fetchScoreboards,
    resetSettings,
}: Props) {
    const scoreboardSettings = useSelector(ScoreboardSettings)
    const liveGameIds = useSelector(LiveGamesIds)
    const isWhatifOn = useSelector(IsWhatifOn)

    useEffect(() => {
        if (isWhatifOn) {
            resetSettings()
        }
    }, [isWhatifOn])

    return (
        <>
            {!isWhatifOn && (
                <TableSettings
                    updateSetting={updateSetting}
                    settings={scoreboardSettings}
                    hasLiveGames={liveGameIds.length > 0}
                    fetchScoreboards={fetchScoreboards}
                />
            )}
        </>
    )
}

const mapDispatchToProps = {
    updateSetting: updateScoreboardSetting,
    resetSettings: resetScoreboardSettings,
}

export default connect(NoSelector, mapDispatchToProps)(TableSettingsProvider)
