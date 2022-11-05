import React, { ReactNode, Suspense } from 'react'
import AppCrucialDataLoader from '../appLoader/AppCrucialDataLoader'
import { CrucialLoader } from '../types'


interface Props {
    name: CrucialLoader
    children: ReactNode
}

export default function SuspenseWithLoader({ name, children }: Props) {
    
    return (
        <Suspense fallback={<AppCrucialDataLoader name={name} />}>
            {children}
        </Suspense>

    )
}


