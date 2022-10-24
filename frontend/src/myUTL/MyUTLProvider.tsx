import React from 'react'
import { useSelector, connect } from 'react-redux'
import { PayloadUpdateMyUTL } from '../api/utls'
import useGoTo from '../hooks/useGoTo'
import { updateMyUTLAndStore } from '../_actions/tournamentUser'
import {
    CurrentTournamentUser,
    NoSelector,
    MyUtlOnScoreboard,
} from '../_selectors'
import MyUTL from './MyUTL'

function MyUTLProvider({ updateMyUTLAndStore }) {
    const currentUtl = useSelector(CurrentTournamentUser)
    const tableData = useSelector(MyUtlOnScoreboard)
    const { goToMyBets } = useGoTo()
    const updateMyUTL = (params: PayloadUpdateMyUTL) =>
        updateMyUTLAndStore(currentUtl.tournament.id, params)

    return (
        <MyUTL
            currentUtl={currentUtl}
            updateUTL={updateMyUTL}
            goToMyBets={goToMyBets}
            tableData={tableData}
        />
    )
}

const mapDispatchToProps = {
    updateMyUTLAndStore,
}

export default connect(NoSelector, mapDispatchToProps)(MyUTLProvider)
