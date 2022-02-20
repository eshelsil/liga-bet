import React, { createContext, useState, useEffect, useContext } from 'react';

const LeaderboardContext = createContext({
	rows: {},
	initialize: ()=>{},
});
const LeaderboardProvider = ({ children }) => {
	const [rows, setRows] = useState({});
	const [initialized, setInitialized] = useState(false);
    const initialize = () => {
		if (initialized) return;
		//get data from API
		const gotFromAPI = {
			1: {
				rank: 1,
				rankDisplay: 1,
				change: 0,
				id: 1,
				user_id: 20,
				name: "Eliyahu Hanavim",
				addedScore: 9,
				total_score: 27,
				relevantMatchBets: [],
				groupRankBets: {},
				specialBets: {},
			}
		}
		setRows(gotFromAPI);
		setInitialized(true);
	};
    return <LeaderboardContext.Provider value={{
        rows,
		initialize,
    }}>
        {children}
    </LeaderboardContext.Provider>
}
export const useLeaderboardContext = () => useContext(LeaderboardContext);
export {LeaderboardProvider}