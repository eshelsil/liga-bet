import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentUser } from '../_selectors'
import MyUser from './MyUser'

function MyUserProvider() {
    const currentUser = useSelector(CurrentUser)

    return <MyUser currentUser={currentUser} />
}

export default MyUserProvider
