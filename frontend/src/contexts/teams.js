import React, { createContext, useState, useEffect } from 'react';

const TeamsContext = createContext(null);
const TeamsProvider = ({ children }) => {
	const [teams, setTeams] = useState({});
    useEffect(()=>{
		//get data from API
		const gotFromAPI = {
			10: {
				name: "Belgium",
				id: 10,
				crest_url: "https://localhost/1111"
			},
			9: {
				name: "Denemark",
				id: 9,
				crest_url: "https://localhost/1111"
			},
			11: {
				name: "Russia",
				id: 11,
				crest_url: "https://localhost/1111"
			},
			12: {
				name: "Finland",
				id: 12,
				crest_url: "https://localhost/1111"
			},
		}
		setTeams(gotFromAPI);
	}, []);
    return <TeamsContext.Provider value={{
        teams,
    }}>
        {children}
    </TeamsContext.Provider>
}
export {TeamsContext}
export {TeamsProvider}