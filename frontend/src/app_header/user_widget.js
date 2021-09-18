import React ,{useContext} from 'react';
import { connect } from 'react-redux'
import { Button, Row} from 'react-bootstrap';
import {SocketContext} from '../_helpers/socket';

import authActions from '../_actions/auth';
import {UserWidgetSelector} from '../_selectors/main';

function UserWidget(props){
    if (props.username === undefined){
        return null;
    }

    const socket = useContext(SocketContext).getSocket('auth');

    function logout(){
        socket.reset_connection()
        props.logout()
    }

    function renderUser(){
        return (
            <Row className="mx-auto mb-2">
                <div className="col-xs-auto">

                    <i className="bi bi-person-fill"></i>
                </div>
                <div className="col-xs-auto">
                    <div className="ml-1">
                    {props.username}
                    </div>
                </div>
            </Row>
        )
    }

    return (
        <div className="UserWidget m-2 p-2 pr-3 col-xs-auto rounded">
            {renderUser()}
            <Row className="mr-auto ml-1">
                <Button variant="danger" onClick={logout}>Logout</Button>
            </Row>
        </div>
    );
}


const mapDispatchToProps = {
    logout: authActions.logout,
}


export default connect(UserWidgetSelector, mapDispatchToProps)(UserWidget);