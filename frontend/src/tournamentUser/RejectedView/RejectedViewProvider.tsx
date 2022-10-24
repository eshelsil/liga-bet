import React from 'react'
import { connect } from 'react-redux'
import { UtlWithTournament, AnyFunc } from '../../types'
import { NoSelector } from '../../_selectors'
import { currentUtlLeaveTournament } from '../../_actions/tournamentUser'
import RejectedView from './RejectedView'

interface Props {
    currentUTL: UtlWithTournament
    currentUtlLeaveTournament: AnyFunc
}

function RejectedViewProvider({
    currentUTL,
    currentUtlLeaveTournament,
}: Props) {
    return (
        <RejectedView
            currentUTL={currentUTL}
            onLeave={currentUtlLeaveTournament}
        />
    )
}

const mapDispatchToProps = {
    currentUtlLeaveTournament,
}

export default connect(NoSelector, mapDispatchToProps)(RejectedViewProvider)
