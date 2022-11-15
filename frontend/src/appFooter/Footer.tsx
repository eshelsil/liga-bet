import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IsLoadingAppCrucial } from '../_selectors'
import './AppFooter.scss'


function ImageLoader(){
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(()=>{
        const timeout = setTimeout(()=> {
            setShouldLoad(true)
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <>
            {shouldLoad && (<>
                <img
                    className='AppFooter-image'
                    src='/img/icon-no-bg.svg'
                />
            </>)}
        </>
    )
}


function AppFooter() {
    const isLoadingAppCrucial = useSelector(IsLoadingAppCrucial)
    return (
        <div className={`LB-AppFooter`}>
            <div className='AppFooter-background'>
                {!isLoadingAppCrucial && (
                    <ImageLoader />
                )}
            </div>
        </div>
    )
}

export default AppFooter
