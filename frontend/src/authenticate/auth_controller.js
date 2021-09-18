import React, { useContext } from 'react';
import { connect } from 'react-redux'
import {SocketContext} from '../_helpers/socket';

import authActions from '../_actions/auth';
import AuthenticatePage from './authenticate'
import {AuthPageSelector} from '../_selectors/main';
import {useOnce} from '../_helpers/custom_hooks';
  

function AuthController(props){

    function use_token_from_storage(){
        console.log('use_token_from_storage' )
        const session_token = sessionStorage['LAST_SESSION_TOKEN'];
        if (session_token){
            console.log('setting token', session_token)
            props.set_token(session_token);
        }
    }
    useOnce(use_token_from_storage);
    console.log('props.has_token', props.has_token)

    const socket = useContext(SocketContext).getSocket('auth');
    const listeners = [
        {
            event: 'apply_jwt_token_failure',
            action: props.invalidate_token
        },
        {
            event: 'authenticate_success',
            action: props.login
        },
        {
            event: 'authenticate_failure',
            action: props.auth_error
        }
    ]
    useOnce( ()=>{
        socket.addListeners(listeners) 
    });

    const login = (username, password)=>{
        props.auth_request()
        socket.emit('login', {username, password})
    }
    const register = (username, password)=>{
        props.auth_request()
        socket.emit('register', {username, password})
    }
    
    if (props.has_token ){
        socket.emit('apply_jwt_token', {token: props.token});
    }
    if (props.logged_in){
        return props.children
    }
    return <AuthenticatePage {...props}
        login={login}
        register={register}
    />
}

const mapDispatchToProps = {
    ...authActions
}


export default connect(AuthPageSelector, mapDispatchToProps)(AuthController);