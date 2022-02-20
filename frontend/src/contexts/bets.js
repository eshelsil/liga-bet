import React, { createContext, useState, useEffect, useContext } from 'react';

const BetsContext = createContext(null);
const BetsProvider = ({ children }) => {
	const [bets, setBets] = useState({});
	const [initialized, setInitialized] = useState(false);
    const initialize = () => {
		if (initialized) return;
		//get data from API
		const gotFromAPI = {
			//bet_id
			3: {
				type: 1,
				type_id: 4,
				user_id: 20,
				data: {
					result_home: 5,
					result_away: 2,
					winner_side: 'home',
				},
				id: 3,
				score: 3,
			},
			4: {
				type: 3,
				type_id: 4,
				user_id: 20,
				data: {
					answer: 5,
				},
				id: 4,
				score: 5,
			},
		}
		setBets(gotFromAPI);
		setInitialized(true);
	};
    return <BetsContext.Provider value={{
        bets,
		initialize,
    }}>
        {children}
    </BetsContext.Provider>
}
export const useBetsContext = () => useContext(BetsContext);
export {BetsProvider}