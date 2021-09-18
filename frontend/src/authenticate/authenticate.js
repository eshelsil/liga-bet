import React, { useState } from 'react';
import { Col, Button, Row } from 'react-bootstrap';
import AuthForm from './auth_form'

function AuthPage(props){
    const [step, setStep] = useState('login');
    const [touched, setTouched] = useState(false);
    const isLoginStep = step == 'login';
    const go_to_login = () => {
        props.auth_clear_errors()
        setStep('login')
    }
    const go_to_registration = () => {
        props.auth_clear_errors()
        setStep('register')
    }
    const switch_step_label = isLoginStep ? 'Register' : 'Login';
    const switch_title = isLoginStep ? 'Don\'t have a user? please' : 'Already have a user? please';
    const title_label = isLoginStep ? 'Please login' : 'Please register';
    const last_auth_user = isLoginStep ? localStorage.getItem('LAST_USERNAME') : null;

    return (
        <Row className="d-flex justify-content-start mx-auto px-5 w-50 h-100 text-left">
            <Col className="p-0">
                <h5 className="mt-4 mb-3">
                    {title_label}
                </h5>
                <AuthForm 
                    authenticate={isLoginStep ? props.login : props.register} 
                    setTouched={setTouched}
                    touched={touched}
                    waiting={props.waiting}
                    last_auth_user={last_auth_user}
                    error={props.error_msg}
                    form_type={step}
                >
                </AuthForm>
                <h6 className="pt-5 mb-3">
                    {switch_title} 
                    <Button
                        tabIndex="-1"
                        variant="light"
                        className="py-0 px-1 mx-2"
                        disabled={props.waiting}
                        onClick={isLoginStep ? go_to_registration : go_to_login}
                    >{switch_step_label}</Button>
                    here
                </h6>
            </Col>
        </Row>
    )
}

export default AuthPage
  