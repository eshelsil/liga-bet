import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Link, MenuItem, Select } from '@mui/material'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { AutoBetStrategy } from '../types'
import { CurrentTournamentId, IsOnAutoBet } from '../_selectors'
import { getUtlPreferences } from '../api/utls'
import { updateMyUTLAndStore } from '../_actions/tournamentUser'
import { AppDispatch } from '../_helpers/store'
import useGoTo from '../hooks/useGoTo'
import './AutoBetPreference.scss'
import TakanonPreviewModal from '@/tournamentConfig/takanonPreview/TakanonPreviewModal'
import AutoBetExplanation from '@/takanon/AutoBetExplanation'

const AutoBetStrategyLabel: Record<AutoBetStrategy, string> = {
    [AutoBetStrategy.Zero]: '0:0',
    [AutoBetStrategy.Random]: 'אקראי',
}

function AutoBetPreference() {
    const dispatch = useDispatch<AppDispatch>()
    const isAutoBetOn = useSelector(IsOnAutoBet)
    const tournamentId = useSelector(CurrentTournamentId)
    const { goToTakanon } = useGoTo()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [strategy, setStrategy] = useState<AutoBetStrategy>()

    useEffect(() => {
        if (!isAutoBetOn || !tournamentId) {
            return
        }
        let active = true
        setLoading(true)
        getUtlPreferences(tournamentId)
            .then((prefs) => {
                if (!active) {
                    return
                }
                if (prefs.auto_bet_strategy) {
                    setStrategy(prefs.auto_bet_strategy)
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })
        return () => {
            active = false
        }
    }, [isAutoBetOn, tournamentId])

    if (!isAutoBetOn) {
        return null
    }

    const onChange = async (value: AutoBetStrategy) => {
        const prev = strategy
        setStrategy(value)
        setSaving(true)
        try {
            await dispatch(
                updateMyUTLAndStore(tournamentId, { auto_bet_strategy: value })
            )
            window['toastr']['success']('הניחוש האוטומטי עודכן')
        } catch (error) {
            setStrategy(prev)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="LB-FloatingFrame LB-AutoBetPreference">
            <SmartToyOutlinedIcon className="autoBetIcon" />
            <span className="autoBetLabel">ניחוש אוטומטי</span>
            {loading ? (
                <CircularProgress size={27} className="autoBetLoader" />
            ) : (
                <Select
                    value={strategy ?? ''}
                    onChange={(e) =>
                        onChange(e.target.value as AutoBetStrategy)
                    }
                    size="small"
                    disabled={saving}
                    className="autoBetSelect"
                    classes={{
                        select: '!py-0.5',
                    }}
                >
                    <MenuItem value={AutoBetStrategy.Zero}>
                        {AutoBetStrategyLabel[AutoBetStrategy.Zero]}
                    </MenuItem>
                    <MenuItem value={AutoBetStrategy.Random}>
                        {AutoBetStrategyLabel[AutoBetStrategy.Random]}
                    </MenuItem>
                </Select>
            )}
            <div className="autoBetExplanationLink">
                <TakanonPreviewModal label="מזה אומר?">
                    <AutoBetExplanation />
                </TakanonPreviewModal>
            </div>
        </div>
    )
}

export default AutoBetPreference
