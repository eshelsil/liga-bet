import React from 'react';
import { connect } from 'react-redux'
import { Col, Row} from 'react-bootstrap';

import UserWidget from './user_widget';
import {AppHeaderSelector} from '../_selectors/main';


function AppHeader(props){
    const {game_id} = props;
    const default_title = "Let's Play Catan!";
    let title = default_title;
    if (game_id){
        title = `Game ${game_id}`;
    }
    return <Row className="AppTitle">
        <Col className="my-auto" xs={2}>
            <UserWidget></UserWidget> 
        </Col>
        <Col className="my-auto" xs={8}>
            <h2>
                {title}
            </h2>
        </Col>
        <Col xs={2}></Col>
    </Row>
}


export default connect(AppHeaderSelector)(AppHeader);