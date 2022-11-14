import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useIsXsScreen } from '../hooks/useMedia'
import { IsLoadingAppCrucial } from '../_selectors'
import './AppFooter.scss'


function ImageLoader({loaded, setLoaded}: {loaded: boolean, setLoaded: (val: boolean) => void}){
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
                    onLoad={() => setLoaded(true)}
                    className='AppFooter-image' src='/img/icon-no-bg.svg'
                />
            </>)}
        </>
    )
}


function AppFooter() {
    const isLoadingAppCrucial = useSelector(IsLoadingAppCrucial)
    const [loaded, setLoaded] = useState(false)
    return (
        <div className={`LB-AppFooter ${loaded ? 'AppFooter-loaded' : ''}`}>
            <div className='AppFooter-background'>
                {!isLoadingAppCrucial && (
                    <ImageLoader
                        loaded={loaded}
                        setLoaded={setLoaded}
                    />
                )}
            </div>
        </div>
    )
}

export default AppFooter
