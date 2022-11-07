import React from 'react'
import { connect, useSelector } from 'react-redux'
import { AppHeaderSelector, NoSelector } from '../_selectors'
import { openDialog } from '../_actions/dialogs'
import AppHeader from './AppHeaderView'
import { DialogName } from '../dialogs/types'
import { ChosenTournamentIndex } from '../_selectors'

function AppHeaderProvider({ openDialog }) {
    const tournamentIndex = useSelector(ChosenTournamentIndex)
    const { isTournamentStarted, currentUtl } =
        useSelector(AppHeaderSelector)


    const openDialogChangePassword = () => openDialog(DialogName.ChangePassword)

    return (
        <AppHeader
            {...{
                isTournamentStarted,
                currentUtl,
                openDialogChangePassword,
                tournamentIndex,
            }}
        />
    )
}

const mapDispatchToProps = {
    openDialog,
}

export default connect(NoSelector, mapDispatchToProps)(AppHeaderProvider)
