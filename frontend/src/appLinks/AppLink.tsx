import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { HasCurrentUtl } from '../_selectors'
import './AppLinks.scss'

export interface AppLinkProps {
    path: string
    label: string
}

function AppLink({ path, label}: AppLinkProps) {
    const hasCurrentUtl = useSelector(HasCurrentUtl)
    const history = useHistory()
    const onClick = (e) => {
        e.preventDefault()
        history.push(path)
    }
    if (!hasCurrentUtl) {
        return null
    }
    return (
        <p className="LigaBet-AppLink">
            <a href={path} onClick={onClick}>
                {label}
            </a>
        </p>
    )
}

export default AppLink
