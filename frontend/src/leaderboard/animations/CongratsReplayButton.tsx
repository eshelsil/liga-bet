import React from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

interface Props {
    rank: number
    dir: 'rtl' | 'ltr'
    onReplay: () => void
    onDismiss: () => void
}

// A shimmering, text-less circle pinned to the bottom corner that replays the congrats
// animation; the small "×" removes it for this app session (see the provider). The icon
// reflects the prize: a trophy for 1st place, a diploma scroll for everyone else.
function CongratsReplayButton({ rank, dir, onReplay, onDismiss }: Props) {
    return (
        <div className="LB-CongratsReplayButton" dir={dir}>
            <button
                type="button"
                className="replay-pill"
                onClick={onReplay}
                aria-label="replay congrats"
            >
                {rank === 1 ? (
                    <EmojiEventsIcon className="replay-icon" />
                ) : (
                    // lucide "ScrollText" (inlined — lucide-react isn't a dependency).
                    <svg
                        className="replay-icon"
                        viewBox="0 0 24 24"
                        width="1em"
                        height="1em"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M15 12h-5" />
                        <path d="M15 8h-5" />
                        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
                    </svg>
                )}
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
