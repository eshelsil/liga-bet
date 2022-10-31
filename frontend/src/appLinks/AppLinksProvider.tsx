import React from 'react'
import { useSelector } from 'react-redux'
import { IsAdmin } from '../_selectors'
import AppLinksView from './AppLinksView'

function AppLinksProvider() {
    const isAdmin = useSelector(IsAdmin)
    return (
        isAdmin
            ? <AppLinksView isAdmin={isAdmin} />
            : null
    )
}

export default AppLinksProvider
