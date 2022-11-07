import React from 'react'
import MyUser from '../myUser'
import MyUTLs from '../myUTLs'
import './MyProfile.scss'


function MyProfile() {
    return (
        <div className="LB-MyProfile">
            <MyUser />
            <MyUTLs />
        </div>
    )
}

export default MyProfile
