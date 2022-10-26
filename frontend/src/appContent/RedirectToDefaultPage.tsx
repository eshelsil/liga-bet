import React, { useEffect } from 'react';
import useDefaultPageRedirect from '../hooks/useDefaultPageRedirect';

function RedirectToDefaultPage() {
    const getRedirectFunc = useDefaultPageRedirect()
    useEffect(getRedirectFunc, [])
    return (<></>)
}

export default RedirectToDefaultPage
