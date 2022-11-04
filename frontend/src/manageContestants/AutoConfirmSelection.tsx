import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
} from '@mui/material'
import { IsOnAutoConfirmUtls } from '../_selectors'
import useIsRendered from '../hooks/useIsRendered'

interface Props {
    updateAutoConfirmPref: (val: boolean) => Promise<void>
}

function AutoConfirmSelection({
    updateAutoConfirmPref,
}: Props) {
    const isRendered = useIsRendered()
    const autoConfirm = useSelector(IsOnAutoConfirmUtls)
    const [loading, setLoading] = useState(false)
    const toggleAutoConfirm = (e: any, value: boolean) => {
        setLoading(true)
        updateAutoConfirmPref(value)
            .then(() => {
                if (value) {
                    (window as any).toastr["success"]('עודכן בהצלחה. מעכשיו משתמשים יאושרו אוטמטית');
                } else {
                    (window as any).toastr["success"]('עודכן בהצלחה. המשתמשים הבאים שירשמו לטורניר יחכו שתאשר אותם לפני שיוכלו להמר');
                }
            })
            .finally(() => {
                if (isRendered) {
                    setLoading(false)
                }
            })
    }

    return (
        <div className='LB-AutoConfirmSelection'>
            <FormControlLabel
                control={
                    <Checkbox
                        size='medium'
                        checked={autoConfirm}
                        onChange={toggleAutoConfirm}
                    />
                }
                disabled={loading}
                label="אשר משתמשים אוטומטית"
            />
            {loading && (
                <div className="loaderContainer">
                    <CircularProgress className="loader" size={20} />
                </div>
            )}
        </div>
    )
}

export default AutoConfirmSelection
