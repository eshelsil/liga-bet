import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../_helpers/store'
import { updateIsLoadingAppCrucial } from '../_actions/appCrucial'


function AppCrucialDataLoader ({name} : {name: string}){
    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
        dispatch(updateIsLoadingAppCrucial(name, true))
        return () => {
            dispatch(updateIsLoadingAppCrucial(name, false))
        }
    }, [])
    return <div />
}

export default AppCrucialDataLoader