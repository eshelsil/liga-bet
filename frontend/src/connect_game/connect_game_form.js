import React, { useRef } from 'react';
import { Button, Row, Col, Alert, Spinner } from 'react-bootstrap';


function ConnectGameForm(props) {
    const game_id_input = useRef();
    function inputChange(){
        props.setTouched(true);
    }
    function submitClick(){
        props.setTouched(false)
    }
    
    function renderInfo(){
        if (props.waiting){
            return <Spinner className="mx-auto mt-2" animation="border" variant="primary" />
        }
        if (!props.touched && props.error){
            return <Alert variant='danger'>
                    <u>Error</u>: {props.error}
              </Alert>
        }
        return
    }
    function renderJoinInput(){
        const join_game = ()=>{
            submitClick()
            let id = game_id_input.current.value
            return props.join_game(id)
        }
        return <Row className="mx-auto">
                <span className="my-auto mr-2">Game ID:</span>
                <input type="text"
                        maxLength="6"
                        className="form-control mini_text_input mr-2"
                        defaultValue={props.target_game_id}
                        onChange={inputChange}
                        ref={game_id_input}>
                </input>
                <Button variant="primary"
                        disabled={props.waiting}
                        onClick={join_game}>
                            Join Game
                </Button>
            </Row>
    }
    function renderCreateInput(){
        const create_game = ()=>{
            submitClick()
            props.create_game()
        }
        return <Button variant="primary" disabled={props.waiting} onClick={create_game}>Create Game</Button>
    }
    return (
        <Col className="p-0 mb-5">
            {props.isJoinStep ? renderJoinInput() : renderCreateInput()}
            <Row className="mx-auto mt-2 w-100 position-absolute">
                {renderInfo()}
            </Row>
      </Col>
    );
}

export default ConnectGameForm