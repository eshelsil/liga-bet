import React, { useState } from 'react'
import { ClickAwayListener, Tooltip } from '@mui/material'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

function AutoBetBadge() {
    const [open, setOpen] = useState(false)

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Tooltip
                title='ניחוש אוטומטי'
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                arrow
            >
                <SmartToyOutlinedIcon
                    onClick={() => setOpen((prev) => !prev)}
                    sx={{
                        fontSize: 18,
                        color: '#6366f1',
                        cursor: 'pointer',
                        verticalAlign: 'middle',
                    }}
                />
            </Tooltip>
        </ClickAwayListener>
    )
}

export default AutoBetBadge
