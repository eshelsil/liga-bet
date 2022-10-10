import React, { ReactNode, useEffect } from 'react'
import { connect } from 'react-redux'
import { User } from '../types'
import { storeCurrentUser } from '../_actions/auth'
import { AuthControllerSelector } from '../_selectors'

interface Props {
    storeCurrentUser: () => void
    user: User
    children: ReactNode
}

function AuthController({ storeCurrentUser, user, children }: Props) {
    useEffect(() => {
        storeCurrentUser()
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
