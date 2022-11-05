import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../_helpers/store'
import { updateIsLoadingAppCrucial } from '../_actions/appCrucial'
import { CrucialLoader } from '../types'


function AppCrucialDataLoader ({name} : {name: CrucialLoader}){
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