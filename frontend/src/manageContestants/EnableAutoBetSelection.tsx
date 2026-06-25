import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material'
import { IsOnAutoBet } from '../_selectors'
import useIsRendered from '../hooks/useIsRendered'

interface Props {
    updateAutoBetPref: (val: boolean) => Promise<void>
}

function EnableAutoBetSelection({ updateAutoBetPref }: Props) {
    const { t } = useTranslation('manageContestants')
    const isRendered = useIsRendered()
    const autoBetOn = useSelector(IsOnAutoBet)
    const [loading, setLoading] = useState(false)
    const toggle = (e: any, value: boolean) => {
        setLoading(true)
        updateAutoBetPref(value)
            .then(() => {
                if (value) {
                    ;(window as any).toastr['success'](t('autoBet.enabledToast'))
                } else {
                    ;(window as any).toastr['success'](t('autoBet.disabledToast'))
                }
            })
            .finally(() => {
                if (isRendered) {
                    setLoading(false)
                }
            })
    }

    return (
        <div className="LB-AutoConfirmSelection whitespace-nowrap">
            <FormControlLabel
                control={
                    <div className="relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {loading && <CircularProgress size={20} />}
                        </div>
                        <Checkbox
                            size="medium"
                            checked={autoBetOn}
                            onChange={toggle}
                            disabled={loading}
                        />
                    </div>
                }
                disabled={loading}
                classes={{root: '!m-0'}}
                label={t('autoBet.label')}
            />
        </div>
    )
}

export default EnableAutoBetSelection
