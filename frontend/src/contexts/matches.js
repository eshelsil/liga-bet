import React, { createContext, useState, useEffect, useContext } from 'react';

const MatchesContext = createContext(null);
const MatchesProvider = ({ children }) => {
	const [matches, setMatches] = useState({});
    useEffect(()=>{
		//get data from API
		const gotFromAPI = {
			3: {
				home_team: {
					name: "Israel",
					id: 4,
					crest_url: "https://localhost/1111"
				},
				away_team: {
					name: "Austria",
					id: 14,
					crest_url: "https://localhost/1111"
				},
				// change to only id
				result_home: 5,
				result_away: 2,
				winner_side: 'home',
				id: 3,
			},
		}
		setMatches(gotFromAPI);
	}, []);
    return <MatchesContext.Provider value={{
        matches,
    }}>
        {children}
    </MatchesContext.Provider>
}
export const useMatchesContext = () => useContext(MatchesContext);
export {MatchesProvider}