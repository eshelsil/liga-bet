import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import {fetchAndStoreCurrentUser} from '../_actions/auth';
import { AuthControllerSelector } from '../_selectors';
  

function AuthController({
    fetchAndStoreCurrentUser,
    user,
    children,
}){


    useEffect( ()=>{
        fetchAndStoreCurrentUser()
        .catch(e => {
            console.log('FAILED to get user', e)
        });
    }, []);

    return <>
        {user?.id !== undefined && (
            <>
                {children}
            </>
        )}
    </>
}

const mapDispatchToProps = {
    fetchAndStoreCurrentUser,
}


export default connect(AuthControllerSelector, mapDispatchToProps)(AuthController);