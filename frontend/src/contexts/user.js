import React, { createContext } from 'react';

const UserContext = createContext(null);
const UserProvider = ({ children }) => {
	const user = {
        ...window.php_data.user
    };
    user.isConfirmed = true;
    return <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
}
export {UserContext}
export {UserProvider}