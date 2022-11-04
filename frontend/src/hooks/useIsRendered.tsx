import React, { useEffect, useState } from 'react'


function useIsRendered() {
    const [isRendered, setIsRendered] = useState(true)

    useEffect(() => {
        return () => {
            setIsRendered(false)
        }
    }, [])

    return isRendered
}

export default useIsRendered
