import React, { ReactNode, Suspense } from 'react'
import AppCrucialDataLoader from '../appLoader/AppCrucialDataLoader'


interface Props {
    name: string
    children: ReactNode
}

export default function SuspenseWithLoader({ name, children }: Props) {
    
    return (
        <Suspense fallback={<AppCrucialDataLoader name={name} />}>
            {children}
        </Suspense>

    )
}


