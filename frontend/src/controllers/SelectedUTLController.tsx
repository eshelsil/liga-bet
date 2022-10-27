import React, { ReactNode } from 'react'
import { isUtlConfirmed } from '../utils'
import NoConfirmationView from '../tournamentUser/NoConfirmationView'
import { UtlWithTournament } from '../types'
import ConfirmedUtlController from './ConfirmedUtlController'

interface Props {
    currentUtl: UtlWithTournament
    children: ReactNode
}

function SelectedUTLController({ currentUtl, children }: Props) {

    const hasSelectedUtl = !!currentUtl
    const utlConfirmed = hasSelectedUtl && isUtlConfirmed(currentUtl)

    return (
        <>
            {hasSelectedUtl && (
                utlConfirmed ? (
                    <ConfirmedUtlController currentUtl={currentUtl}>
                        {children}
                    </ConfirmedUtlController>
                ) : (
                    <NoConfirmationView currentUTL={currentUtl} />
                )
            )}
        </>
    )
}

export default SelectedUTLController
