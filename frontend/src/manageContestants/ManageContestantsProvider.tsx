import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { connect } from 'react-redux'
import { updateAutoConfirmPreference } from '../_actions/tournament'
import {
    fetchAndStoreTournamentUtls,
    makeContestant,
    makeManager,
    removeAndStoreUTL,
} from '../_actions/tournamentUTLs'
import { NoSelector } from '../_selectors'
import { ManageTournamentUTLsSelector } from '../_selectors/manageTournamentUTLs'
import ManageContestantsView from './ManageContestantsView'

function ManageContestants({
    makeManager,
    makeContestant,
    removeAndStoreUTL,
    fetchAndStoreTournamentUtls,
    updateAutoConfirmPref,
}) {
    const { utlsById, isTournamentAdmin, currentUtlId, hasManagerPermissions } =
        useSelector(ManageTournamentUTLsSelector)

    useEffect(() => {
        fetchAndStoreTournamentUtls()
    }, [])

    return (
        <>
            <ManageContestantsView
                utls={Object.values(utlsById)}
                currentUtlId={currentUtlId}
                isTournamentAdmin={isTournamentAdmin}
                hasManagerPermissions={hasManagerPermissions}
                confirmUTL={makeContestant}
                removeManagerPermissions={makeContestant}
                updateAutoConfirmPref={updateAutoConfirmPref}
                promoteToManager={makeManager}
                removeUTL={removeAndStoreUTL}
            />
        </>
    )
}

const mapDispatchToProps = {
    makeManager,
    makeContestant,
    removeAndStoreUTL,
    fetchAndStoreTournamentUtls,
    updateAutoConfirmPref: updateAutoConfirmPreference,
}

export default connect(NoSelector, mapDispatchToProps)(ManageContestants)
