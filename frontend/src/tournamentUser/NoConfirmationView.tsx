import React from 'react'
import { UtlWithTournament } from '../types'
import { isUtlRejected, isUtlWaitingForApproval } from '../utils'
import NotConfirmedUtlView from './NotConfirmedUtlView'
import RejectedViewProvider from './RejectedView/RejectedViewProvider'

interface Props {
    currentUTL: UtlWithTournament
}

function NoConfirmationView({ currentUTL }: Props) {
    const isRoleNotConfirmed = isUtlWaitingForApproval(currentUTL)
    const isRoleRejected = isUtlRejected(currentUTL)

    return (
        <>
            {isRoleNotConfirmed && (
                <NotConfirmedUtlView currentUTL={currentUTL} />
            )}
            {isRoleRejected && <RejectedViewProvider currentUTL={currentUTL} />}
        </>
    )
}

export default NoConfirmationView
