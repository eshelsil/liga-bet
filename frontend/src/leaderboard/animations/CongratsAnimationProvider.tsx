import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
    CongratsAnimationSelector,
    CurrentTournamentUser,
} from '../../_selectors'
import { AppDispatch } from '../../_helpers/store'
import { markCongratsSeen } from '../../_actions/tournament'
import CongratsAnimation from './CongratsAnimation'
import CongratsReplayButton from './CongratsReplayButton'
import './Animation.scss'

function CongratsAnimationProvider() {
    const dispatch = useDispatch<AppDispatch>()
    const { i18n } = useTranslation()
    const { isAvailable, shouldAutoShow, currentUtlRank, entry, lang } =
        useSelector(CongratsAnimationSelector)
    const currentUtl = useSelector(CurrentTournamentUser)

    // Dismissal is per react-app session only (in-memory) — intentionally NOT persisted to
    // sessionStorage, so a refresh brings the replay button back (the animation still won't
    // auto-play, since the user has already seen it — that's tracked server-side).
    const [dismissed, setDismissed] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [playKey, setPlayKey] = useState(0)
    const autoPlayedRef = useRef(false)

    useEffect(() => {
        if (shouldAutoShow && !autoPlayedRef.current) {
            autoPlayedRef.current = true
            setPlaying(true)
        }
    }, [shouldAutoShow])

    const replay = () => {
        setPlayKey((key) => key + 1)
        setPlaying(true)
    }

    const dismiss = () => {
        setDismissed(true)
    }

    const onSeenAnimation = () => {
        dispatch(markCongratsSeen())
    }

    const onFinished = () => {
        setPlaying(false)
    }

    if (!isAvailable || !entry || !currentUtl || currentUtlRank == null) {
        return null
    }

    return (
        <>
            {playing && (
                <CongratsAnimation
                    key={playKey}
                    currentUtl={currentUtl}
                    rank={currentUtlRank}
                    type={entry.type}
                    title={entry.title}
                    msg={entry.msg}
                    lang={lang}
                    onSeenAnimation={onSeenAnimation}
                    onFinished={onFinished}
                />
            )}
            {!playing && !dismissed && (
                <CongratsReplayButton
                    rank={currentUtlRank}
                    dir={i18n.dir() === 'rtl' ? 'rtl' : 'ltr'}
                    onReplay={replay}
                    onDismiss={dismiss}
                />
            )}
        </>
    )
}

export default CongratsAnimationProvider
