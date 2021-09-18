import React, { useState } from 'react';
import { Button, Col ,Row } from 'react-bootstrap';
import ConnectGameForm from './connect_game_form';


function ConnectGamePage(props){
    const [step, setStep] = useState('join');
    const [touched, setTouched] = useState(false);
    const isJoinStep = step == "join";
    const go_to_join = ()=> {
        props.clear_errors()
        setStep("join")
    }
    const go_to_create = ()=> {
        props.clear_errors()
        setStep("create")
    }

    const join_title = "Please enter game id and join game"
    const create_title = "Click here to create a new game"
    const go_to_join_label = "Join Game"
    const go_to_create_label = "Create Game"
    const title = isJoinStep ? join_title : create_title
    const button_label = isJoinStep ? go_to_create_label : go_to_join_label

    return (
        <Row className="d-flex justify-content-start mx-auto px-5 w-50 h-100 text-left">
            <Col className="p-0">
                <h5 className="mt-4 mb-3">
                    {title}
                </h5>
                <ConnectGameForm 
                    join_game={props.join_game} 
                    create_game={props.create_game} 
                    setTouched={setTouched}
                    touched={touched}
                    isJoinStep={isJoinStep}
                    target_game_id={props.target_game_id}
                    waiting={props.waiting} 
                    error={props.error_msg}>
                </ConnectGameForm>
                <h6 className="pt-5 mb-3">
                    Or  
                    <Button
                        tabIndex="-1"
                        variant="light"
                        className="py-0 px-1 ml-2"
                        disabled={props.waiting}
                        onClick={isJoinStep ? go_to_create : go_to_join}
                        >{button_label}</Button>
                </h6>
            </Col>
        </Row>
    )
}


export default ConnectGamePage
  