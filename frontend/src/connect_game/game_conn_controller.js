import React, {useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom'
import { connect } from 'react-redux'

import {SocketContext} from '../_helpers/socket';
import gameActions from '../_actions/game_connection';
import authActions from '../_actions/auth';
import ConnectGamePage from './connect_game'
import {ConnectGamePageSelector} from '../_selectors/main';
import {useOnce} from '../_helpers/custom_hooks';
  

function GameConnectionController(props){
    if (props.is_connected && props.children){
        return props.children
    }

    const {jwt_token} = props;
    const socket = useContext(SocketContext).getSocket('game', {jwt_token});

    const history = useHistory();
    const {game_id: target_game_id} = useParams();

    function connect_game(data){
        history.push(`/${data.game_id}`)
        props.connect_game(data)
    }

    function invalidate_token(error){
        console.log('invalidate token', error)
        props.invalidate_token()
    }

    const listeners = [
        {
            event: 'connect_error',
            action: invalidate_token
        },
        // {
        //     event: 'unauthorized',
        //     action: invalidate_token
        // },
        // {
        //     event: 'authenticated',
        //     action: login
        // },
        {
            event: 'connect_game_success',
            action: connect_game
        },
        {
            event: 'connect_game_failure',
            action: props.connect_game_error
        }
    ]
    useOnce( ()=>{
        socket.addListeners(listeners) 
    });
    
    const join_game = (game_id)=>{
        props.connect_game_waiting()
        socket.emit('join_game', {game_id})
    }
    const create_game = ()=>{
        props.connect_game_waiting()
        socket.emit('create_game')
    }

    return <ConnectGamePage 
            {...props}
            join_game={join_game}
            create_game={create_game}
            target_game_id={target_game_id}
        />
}

const mapDispatchToProps = {
    ...gameActions,
    invalidate_token: authActions.invalidate_token,
}


export default connect(ConnectGamePageSelector, mapDispatchToProps)(GameConnectionController);