import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CongratsAnimationSelector,
    CurrentTournamentId,
    CurrentTournamentUser,
} from '../../_selectors'
import { AppDispatch } from '../../_helpers/store'
import { markCongratsSeen } from '../../_actions/tournament'
import CongratsAnimation from './CongratsAnimation'
import CongratsReplayButton from './CongratsReplayButton'
import { getReplayButtonLabel } from './utils'
import './Animation.scss'

function CongratsAnimationProvider() {
    const dispatch = useDispatch<AppDispatch>()
    const { isAvailable, shouldAutoShow, currentUtlRank, entry, lang } =
        useSelector(CongratsAnimationSelector)
    const currentUtl = useSelector(CurrentTournamentUser)
    const tournamentId = useSelector(CurrentTournamentId)

    const dismissKey = `LigaBetDismissedCongratsButton_${tournamentId}`
    const [dismissed, setDismissed] = useState(
        () => sessionStorage.getItem(dismissKey) === '1'
    )
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
        sessionStorage.setItem(dismissKey, '1')
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
                    label={getReplayButtonLabel(lang)}
                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                    onReplay={replay}
                    onDismiss={dismiss}
                />
            )}
        </>
    )
}

export default CongratsAnimationProvider
