import React, { useRef, useEffect, useState } from 'react';
import { Alert, Row, Col, Spinner, Button } from 'react-bootstrap';

function TextInput(props){
    const {onChange, type="text", placeholder="", value=''} = props;
    return <input className="form-control text_input mb-2"
            type={type}
            onChange={e=>onChange(e.target.value)}
            placeholder={placeholder}
            value={value}
        ></input>
}


function AuthForm(props) {
    // const username_input = useRef();
    console.log('rendering');
    const password_input = useRef();
    const [userInput, setUsernameInput] = useState(props.last_auth_user ?? '');
    const isLoginForm = props.form_type == 'login';
    function inputChange(){
        props.setTouched(true);
    }
    function userInputChange(val){
        setUsernameInput(val);
        inputChange();
    }
    
    const authenticate = ()=>{
        // let username = username_input.current.value
        let username = userInput;
        let password = password_input.current.value
        props.setTouched(false)
        return props.authenticate(username, password)
    }
    function renderInfo(){
        if (props.waiting){
            return <Spinner className="mr-auto ml-2 mt-2" animation="border" variant="primary" />
        }
        if (!props.touched && props.error){
            return <Alert variant='danger'>
                        <u>Error</u>: {props.error}
                    </Alert>
        }
        return
    }

    const submit_label = isLoginForm ? 'Login' : 'Register';

    useEffect(()=>{
        if (props.last_auth_user != null && !props.touched ){
            password_input.current.focus()  
        } else {
            // username_input.current.focus()
        }
    })


    return (
      <Col className="px-0 mb-5">
           {/* <input className="form-control text_input mb-2"
            key={`${props.form_type}_form_username_input`}
            onChange={inputChange}
            placeholder='Username'
            defaultValue={props.last_auth_user}
            ref={username_input}>
        </input> */}
        <TextInput placeholder={'Username'} value={userInput} onChange={userInputChange}></TextInput>
        <input className="form-control text_input mb-2"
            key={`${props.form_type}_for_password_input`}
            type="password"
            onChange={inputChange}
            placeholder='Password'
            ref={password_input}>        
        </input>
        <Button variant="primary"
                disabled={props.waiting}
                onClick={authenticate}>
                    {submit_label}
        </Button>
        <Row className="mx-auto mt-2 w-100 position-absolute">
                {renderInfo()}
        </Row>
      </Col>
    );
}

export default AuthForm;