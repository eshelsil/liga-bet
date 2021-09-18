import React from 'react';
import { Button, Row, Col, Table, Badge } from 'react-bootstrap';
import {mapColorToClass} from '../_consts/player_colors';


function GameLobby(props){
    const {username, is_registered, players, game_admin, is_game_admin, available_colors, seats_amount} = props
    console.log('username, is_registered, players, game_admin, is_game_admin, available_colors, seats_amount', username, is_registered, players, game_admin, is_game_admin, available_colors, seats_amount)

    function isAdmin(player){
        return player.username === game_admin;
    }
    function isCurrent(player){
        return player.username === username;
    }


    const renderSeat = (index) =>{
        const user = players[index];
        const remove_player = ()=>{
            props.remove_player(user.username)
        }

        function renderUser(){
            if (!user){
                return null;
            }
            const adminBadge = isAdmin(user) ? <Badge variant="primary" className="ml-2">Admin</Badge> : null;
            const currentUserBadge = isCurrent(user) ? <Badge variant="light" className="ml-2">You</Badge> : null;
            return <td className="align-middle">
                {user.username}{adminBadge}{currentUserBadge}
                </td>
        }

        function renderColors(){
            if (!user){
                return null;
            }
            const color_options = isCurrent(user) ? available_colors : [];
            const colorClass = mapColorToClass[user.color]
            return <td className="align-middle">
                <Row className="mx-auto">
                    <div className={`color-square selected ${colorClass}`}></div>
                    {color_options.map((color)=>{
                        const handleClick = ()=>{props.set_player_color(color)}
                        return <div
                                key={color}
                                onClick={handleClick}
                                className={`color-square selectable ${mapColorToClass[color]}`}
                                />
                    })}
                </Row>
            </td>
        }

        function renderAction(){
            let action_button;
            if (!user){
                if (is_registered){
                    return null;
                }
                action_button = <Button variant="primary" className="px-3 ml-3" size="sm" onClick={props.register_player}>Sit</Button>
            } else if (isCurrent(user) && is_game_admin) {
                return null;
            } else if (is_game_admin){
                action_button = <Button variant="danger" className="px-3 ml-3" size="sm" onClick={remove_player}>Kick</Button>   
            } else if (isCurrent(user)){
                action_button = <Button variant="danger" className="px-3 ml-3" size="sm" onClick={remove_player}>Leave</Button>
            }
            return <td className="align-middle">
                    {action_button}
                </td>
        }

        return <tr key={index}>
            <td className="align-middle">{index+1}.</td>
            {renderUser()}
            {renderColors()}
            {renderAction()}
        </tr>
    }

    return (    
        
        <Row className="d-flex justify-content-start mx-auto px-5 w-50 text-left">
            <Col>
                <Table borderless className="fit-content-width">
                    <tbody>
                        {[...Array(props.seats_amount).keys()].map((i)=>{
                            return renderSeat(i)
                        })}
                    </tbody>
                </Table>
                
                <Button variant="danger" className="mt-3" onClick={props.exit_game}>Exit Game</Button>
            </Col>
        </Row>
    )
}

export default GameLobby;
  