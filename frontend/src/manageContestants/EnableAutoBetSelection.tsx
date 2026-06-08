import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material'
import { IsOnAutoBet } from '../_selectors'
import useIsRendered from '../hooks/useIsRendered'

interface Props {
    updateAutoBetPref: (val: boolean) => Promise<void>
}

function EnableAutoBetSelection({ updateAutoBetPref }: Props) {
    const isRendered = useIsRendered()
    const autoBetOn = useSelector(IsOnAutoBet)
    const [loading, setLoading] = useState(false)
    const toggle = (e: any, value: boolean) => {
        setLoading(true)
        updateAutoBetPref(value)
            .then(() => {
                if (value) {
                    ;(window as any).toastr['success'](
                        'עודכן בהצלחה. מעכשיו משתתפים ששכחו לנחש יקבלו ניחוש אוטומטי'
                    )
                } else {
                    ;(window as any).toastr['success'](
                        'עודכן בהצלחה. משתתפים ששכחו לנחש לא יקבלו ניחוש אוטומטי'
                    )
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
                label="הפעל ניחוש אוטומטי כגיבוי"
            />
        </div>
    )
}

export default EnableAutoBetSelection
