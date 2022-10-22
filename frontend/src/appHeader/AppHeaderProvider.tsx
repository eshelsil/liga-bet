import React from 'react'
import { connect, useSelector } from 'react-redux'
import { AppHeaderSelector, NoSelector } from '../_selectors'
import { openDialog } from '../_actions/dialogs'
import useGoTo from '../hooks/useGoTo'
import AppHeader from './AppHeaderView'
import { DialogName } from '../dialogs/types'
import { ChosenTournamentIndex } from '../_selectors'

function AppHeaderProvider({ openDialog }) {
    const tournamentIndex = useSelector(ChosenTournamentIndex)
    const { goToUserPage, goToUtlPage } = useGoTo()
    const { isTournamentStarted, currentUsername, currentUtl } =
        useSelector(AppHeaderSelector)


    const openDialogChangePassword = () => openDialog(DialogName.ChangePassword)

    return (
        <AppHeader
            {...{
                isTournamentStarted,
                currentUsername,
                currentUtl,
                goToUserPage,
                goToUtlPage,
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
