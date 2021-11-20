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
				relevantMatchBets: [
					{
						id: 3,
						bet: {
							home: 1,
							away: 1,
							ko_winner_side: 'away',
						},
						score: 3,
					}
				],
				groupRankBets:{
					"GROUP_A":{
						name: "Group A",
						id: "GROUP_A",
						isDone: true,
						score: 3,
						positions: {
							1: 10,
							2: 12,
							3: 9,
							4: 11,
						}
					}
				},
				specialBets:{
					1: {
						id: 1,
						score: null,
						bet: "haim"
					},
					2: {
						id: 2,
						score: 10,
						bet: 7,
					},
				}

			}
		}
		setLeaderboard(gotFromAPI);
		setInitialized(true);
	};
    return <LeaderboardContext.Provider value={{
        groups: leaderboard,
		initialize,
    }}>
        {children}
    </LeaderboardContext.Provider>
}
export {LeaderboardContext}
export {LeaderboardProvider}