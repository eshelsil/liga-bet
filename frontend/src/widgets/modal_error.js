import React, { useState, useContext } from 'react';
import {Modal, Button, Row} from 'react-bootstrap'
import { connect } from 'react-redux'

import {SocketContext} from '../_helpers/socket';
import {useOnce} from '../_helpers/custom_hooks';
import serverErrorActions from '../_actions/server_error'
import { ServerErrorSelector } from '../_selectors/main';

const ServerErrorModal = (props) =>{
    const {has_error, title, msg} = props;
    const [shown, setShown] = useState(false);
    const socket = useContext(SocketContext).getSocket('auth');

    let error_reported = false
    function report_server_error(error){
        if (error_reported){
            return
        }
        error_reported = true
        console.log('Inrternal Server Error:', error)
        const server_error_msg = "Plaese see error on console.log or go to server logs to see stackTrace";
        const server_error_title = "Internal Server Error";
        props.report_error({
            msg: server_error_msg,
            title: server_error_title,
        })
    }
    
    const listeners = [
        {
            event: 'connect_error',
            action: report_server_error
        },
    ]
    useOnce( ()=>{
        socket.addListeners(listeners) 
    });

    const show = !shown && has_error
    const close = ()=> setShown(true);
    return <Modal show={show} onHide={close} >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{msg}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={close}>OK</Button>
            </Modal.Footer>
        </Modal>

}

const mapDispatchToProps = {
    ...serverErrorActions
}

export default connect(ServerErrorSelector, mapDispatchToProps)(ServerErrorModal);

