import React from 'react'
import { useLocation } from 'react-router-dom'


function useActivePath(path: string | string[]) {
    const pathes = Array.isArray(path) ? path : [path]
    const location = useLocation()
    const currentRoute = location.pathname.substring(1)
    return pathes.includes(currentRoute)
}

export default useActivePath
