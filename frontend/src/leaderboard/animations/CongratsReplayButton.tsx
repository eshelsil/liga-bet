import React from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

interface Props {
    label: string
    dir: 'rtl' | 'ltr'
    onReplay: () => void
    onDismiss: () => void
}

function CongratsReplayButton({ label, dir, onReplay, onDismiss }: Props) {
    return (
        <div className="LB-CongratsReplayButton" dir={dir}>
            <button type="button" className="replay-pill" onClick={onReplay}>
                <EmojiEventsIcon className="replay-icon" />
                <span className="replay-label">{label}</span>
            </button>
            <IconButton
                className="replay-dismiss"
                size="small"
                aria-label="dismiss"
                onClick={(e) => {
                    e.stopPropagation()
                    onDismiss()
                }}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>
        </div>
    )
}

export default CongratsReplayButton
