import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IsMultiBetDefaultForAll, NoSelector } from '../_selectors'
import { initializeMultiBetExplanationDialog, updateForAllTournamentsDefault } from '../_actions/multiBetsSettings'
import { useSelector } from 'react-redux'
import { openDialog } from '../_actions/dialogs'
import { DialogName, ToggleDialogStateFunction } from '../dialogs/types'
import MultiBetsSettingsView from './MultiBetsSettingsView'


interface Props {
    setForAllTournaments: (value: boolean) => void
    openDialog: ToggleDialogStateFunction
    initializeMultiBetExplanationDialog: () => void
}

function MultiBetsSettingsProvider({ setForAllTournaments, openDialog, initializeMultiBetExplanationDialog }: Props) {
    const forAllTournaments = useSelector(IsMultiBetDefaultForAll)
    const [pinned, setPinned] = useState(true)
    const openExplanationDialog = () => openDialog(DialogName.MultiBetExplanation)

    useEffect(()=> {
        initializeMultiBetExplanationDialog()
    }, [])

    return (
        <MultiBetsSettingsView
            onInfoClick={openExplanationDialog}
            forAllTournaments={forAllTournaments}
            setForAllTournaments={setForAllTournaments}
            pinned={pinned}
            setPinned={setPinned}
        />
    )
}

const mapDispatchToProps = {
    setForAllTournaments: updateForAllTournamentsDefault,
    openDialog,
    initializeMultiBetExplanationDialog,
}

export default connect(NoSelector, mapDispatchToProps)(MultiBetsSettingsProvider)
