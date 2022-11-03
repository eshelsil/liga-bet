import React from 'react'
import { useHistory } from 'react-router-dom'

function useSessionReidrectPath() {
    const history = useHistory()

    const redirectAfterLogin = () => {
        const sessionRedirectData = JSON.parse(sessionStorage.getItem('LigaBet-redirectAfterLogin'))
        sessionStorage.removeItem('LigaBet-redirectAfterLogin')
        if (sessionRedirectData) {
            const now = Number(new Date())
            const ts = Number(new Date(sessionRedirectData?.timestamp))
            const timeToAuthenticate = 2 * 60 * 1000 // Two minutes
            if (now - ts < timeToAuthenticate) {
                history.push(`/${sessionRedirectData.path}`)
            }
        }
    }

    return {
        redirectAfterLogin
    }
}

export default useSessionReidrectPath
