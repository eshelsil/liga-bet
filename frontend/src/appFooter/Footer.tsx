import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useIsXsScreen } from '../hooks/useMedia'
import { IsLoadingAppCrucial } from '../_selectors'
import './AppFooter.scss'


function ImageLoader(){
    const isXsScreen = useIsXsScreen()
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(()=>{
        const timeout = setTimeout(()=> {
            setShouldLoad(true)
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [])
    console.log({shouldLoad})

    return (
        <>
            {shouldLoad && (<>
                {isXsScreen && (
                    <img className='AppFooter-image' src='/img/logo-small.svg' />
                )}
                {!isXsScreen && (
                    <img className='AppFooter-image' src='/img/logo-big.svg' />
                )}
            </>)}
        </>
    )
}


function AppFooter() {
    const isLoadingAppCrucial = useSelector(IsLoadingAppCrucial)
    return (
        <div className='LB-AppFooter'>
            <div className='AppFooter-background'>
                {!isLoadingAppCrucial && (
                    <ImageLoader />
                )}
            </div>
        </div>
    )
}

export default AppFooter
