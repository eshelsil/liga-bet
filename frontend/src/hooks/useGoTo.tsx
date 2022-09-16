import React from 'react';
import { useHistory } from 'react-router-dom';


function useGoTo(){
	const history = useHistory();

    const goToUserPage = () => history.push('/user');
    const goToUtlPage = () => history.push('/utl');

    return {
        goToUserPage,
        goToUtlPage,
    }
}


export default useGoTo;