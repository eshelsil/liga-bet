import React, { ReactNode, useEffect } from 'react'
import { connect } from 'react-redux'
import { User } from '../types'
import { storeCurrentUser } from '../_actions/auth'
import { AuthControllerSelector } from '../_selectors'
import useSessionReidrectPath from './useSessionReidrectPath'

interface Props {
    storeCurrentUser: () => void
    user: User
    children: ReactNode
}

function AuthController({ storeCurrentUser, user, children }: Props) {
    const { redirectAfterLogin } = useSessionReidrectPath()

    useEffect(() => {
        storeCurrentUser()
        redirectAfterLogin()
    }, [])

    return <>{user?.id !== undefined && <>{children}</>}</>
}

const mapDispatchToProps = {
    storeCurrentUser,
}

export default connect(
    AuthControllerSelector,
    mapDispatchToProps
)(AuthController)
