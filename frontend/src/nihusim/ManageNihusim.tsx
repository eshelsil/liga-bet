import React from 'react'
import { CurrentTournamentUser, EverGrantedNihus, } from '../_selectors'
import { useSelector } from 'react-redux'


const ManageNihusim = () => {
    const {nihusimLeft = 0, nihusimGranted=0, nihusimSent=0} = useSelector(CurrentTournamentUser)   
    const pageVisible = useSelector(EverGrantedNihus)   


    return (
        <>
        {pageVisible && (
            <div>
                <h1 className='LB-TitleText'>הניחוסים שלי</h1>
                <h3 className='LB-TitleText'>כמות: {nihusimLeft}</h3>
                <h3 className='LB-TitleText'>סה"כ הוענקו: {nihusimGranted}</h3>
                <h3 className='LB-TitleText'>סה"כ נוצלו: {nihusimSent}</h3>
            </div>
        )}
        </>
    )
}

export default ManageNihusim
