import React, { createContext, useState, useEffect } from 'react';

const LeaderboardContext = createContext(null);
const LeaderboardProvider = ({ children }) => {
	const [leaderboard, setLeaderboard] = useState({});
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
				name: "Eliyahu Hanavim",
				addedScore: 9,
				total_score: 27,
			}
		}
		setLeaderboard(gotFromAPI);
		setInitialized(true);
	};
    return <LeaderboardContext.Provider value={{
        leaderboard,
		initialize,
    }}>
        {children}
    </LeaderboardContext.Provider>
}
export {LeaderboardContext}
export {LeaderboardProvider}