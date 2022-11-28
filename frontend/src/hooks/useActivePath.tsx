import React from 'react'
import { useRouteMatch } from 'react-router-dom'


function useActivePath(path: string | string[]): boolean {
    const pathes = Array.isArray(path) ? path : [path]
    for (const path of pathes){
        const match = useRouteMatch(`/${path}`)
        if (match){
            return true
        }
    }
    return false
}

export default useActivePath
