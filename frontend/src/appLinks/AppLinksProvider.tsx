import React from 'react'
import { useSelector } from 'react-redux'
import { IsAdmin } from '../_selectors'
import AppLinksView from './AppLinksView'

function AppLinksProvider() {
    const isAdmin = useSelector(IsAdmin)
    return <AppLinksView isAdmin={isAdmin} />
}

export default AppLinksProvider
