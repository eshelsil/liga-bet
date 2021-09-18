import React, {useContext, useEffect} from 'react';
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';

import {SocketContext} from '../_helpers/socket';
import gameActions from '../_actions/game_connection';
import playersActions from '../_actions/players';
import LobbyPage from './lobby'
import {GameLobbySelector} from '../_selectors/main'
import {useOnce} from '../_helpers/custom_hooks';
  


function LobbyController(props){
    const {username} = props;

    const socket = useContext(SocketContext).getSocket();
    const history = useHistory();
    function exit_game(){
        socket.emit('leave_game')
    }
    function game_disconnected(){
        props.disconnect_game();
        history.push('/')
    }

    const listeners = [
        {
            event: 'players_data',
            action: props.set_players
        },
        {
            event: 'disconnect_game_success',
            action: game_disconnected
        },
    ]
    useOnce( ()=>{
        socket.addListeners(listeners) 
    });
    
    useEffect(()=>{
        socket.emit('get_players_data');
    }, [])
    

    function delete_game(){
        //todo
        history.push('/')
    }

    function register_player(){
        socket.emit('register_player', {username})
    }
    function remove_player(username){
        socket.emit('remove_player', {username})
    }
    function set_player_color(color){
        socket.emit('player_set_color', {username, color})
    }

    return <LobbyPage {...props}
        register_player={register_player}
        remove_player={remove_player}
        set_player_color={set_player_color}
        exit_game={exit_game}
    />
}

const mapDispatchToProps = {
    disconnect_game: gameActions.disconnect_game,
    ...playersActions
}

export default connect(GameLobbySelector, mapDispatchToProps)(LobbyController);