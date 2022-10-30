import React from 'react'
import { useSelector, connect } from 'react-redux'
import { updateMyUTLAndStore, selectUtl } from '../_actions/tournamentUser'
import {
    NoSelector,
    CurrentTournamentUserId,
    MyUtlsSorted,
    MyScoreByTournamentId,
} from '../_selectors'
import MyUTLs from './MyUTLs'

function MyUTLsProvider({ updateMyUTLAndStore, selectUtl }) {
    const currentUtlId = useSelector(CurrentTournamentUserId)
    const myUtls = useSelector(MyUtlsSorted)
    const myScores = useSelector(MyScoreByTournamentId)

    return (
        <MyUTLs
            utls={myUtls}
            currentUtlId={currentUtlId}
            updateUTL={updateMyUTLAndStore}
            selectUtl={selectUtl}
            myScores={myScores}
        />
    )
}

const mapDispatchToProps = {
    updateMyUTLAndStore,
    selectUtl,
}

export default connect(NoSelector, mapDispatchToProps)(MyUTLsProvider)
