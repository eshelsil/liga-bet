import React from 'react'
import CreateNewTournament from './CreateNewTournament'
import DefaultNoUtlView from './DefaultNoUtlView'
import './style.scss'

function UserWithNoTournamentsView({
    isMissingUtl
} : {
    isMissingUtl: boolean
}) {

    const enforceCreateView = isMissingUtl

    return (<>
        {enforceCreateView && (
            <CreateNewTournament />
        )}
        {!enforceCreateView && (
            <DefaultNoUtlView />
        )}
    </>)
}

export default UserWithNoTournamentsView
