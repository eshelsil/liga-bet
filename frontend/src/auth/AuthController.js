import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import {fetch_current_user} from '../_actions/auth';
import { AuthControllerSelector } from '../_selectors';
  

function AuthController({
    fetch_current_user,
    user,
    children,
}){


    useEffect( ()=>{
        fetch_current_user()
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
    fetch_current_user,
}


export default connect(AuthControllerSelector, mapDispatchToProps)(AuthController);