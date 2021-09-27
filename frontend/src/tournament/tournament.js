import React, { createContext, useState, useEffect } from 'react';

const TournamentContext = createContext(null);
const TournamentProvider = ({ children }) => {
	const [data, setData] = useState({});
    const { state } = data;
    useEffect(()=>{
		//get data from API
		const gotFromAPI = {
			state: 'ongoing' // initial/ongoing/finished
		}
		setData(gotFromAPI);
	}, []);
    const isStarted = state !== 'initial';
    const isFinished = state !== 'finished';
    return <TournamentContext.Provider value={{
        isStarted,
        isFinished,
    }}>
        {children}
    </TournamentContext.Provider>
}
export {TournamentContext}
export {TournamentProvider}