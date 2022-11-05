import React from 'react'
import { useIsXsScreen } from '../hooks/useMedia'
import './AppFooter.scss'

function AppFooter() {
    const isXsScreen = useIsXsScreen()
    return (
        <div className='LB-AppFooter'>
            <div className='AppFooter-background'>
                {isXsScreen && (
                    <img className='AppFooter-image' src='/img/logo-small.svg' />
                )}
                {!isXsScreen && (
                    <img className='AppFooter-image' src='/img/logo-big.svg' />
                )}
            </div>
        </div>
    )
}

export default AppFooter
