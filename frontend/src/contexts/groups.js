import React, { createContext, useState, useEffect } from 'react';

const GroupsContext = createContext(null);
const GroupsProvider = ({ children }) => {
	const [groups, setGroups] = useState({});
	const [initialized, setInitialized] = useState(false);
    const initialize = () => {
		if (initialized) return;
		//get data from API
		const gotFromAPI = {
			"GROUP_A": {
				name: "Group A",
				id: "GROUP_A",
				isDone: true,
				positions: {
					1: 12,
					2: 10,
					3: 9,
					4: 11,
				}
			}
		}
		setGroups(gotFromAPI);
		setInitialized(true);
	};
    return <GroupsContext.Provider value={{
        groups,
		initialize,
    }}>
        {children}
    </GroupsContext.Provider>
}
export {GroupsContext}
export {GroupsProvider}