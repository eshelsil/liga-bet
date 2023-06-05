import React from 'react'
import { connect } from 'react-redux'
import { LiveGamesIds, NoSelector, ScoreboardSettings } from '../_selectors'
import { useSelector } from 'react-redux'
import { updateScoreboardSetting } from '../_actions/scoreboardSettings'
import TableSettings from './TableSettings'
import { UpdateSettingFunc } from '../_reducers/scoreboardSettings'


interface Props {
    updateSetting: UpdateSettingFunc
    fetchScoreboards: () => void
}

function TableSettingsProvider({ updateSetting, fetchScoreboards }: Props) {
    const scoreboardSettings = useSelector(ScoreboardSettings)
    const liveGameIds = useSelector(LiveGamesIds)

    return (
        <TableSettings
            updateSetting={updateSetting}
            settings={scoreboardSettings}
            hasLiveGames={liveGameIds.length > 0}
            fetchScoreboards={fetchScoreboards}
        />
    )
}

const mapDispatchToProps = {
    updateSetting: updateScoreboardSetting,
}

export default connect(NoSelector, mapDispatchToProps)(TableSettingsProvider)
