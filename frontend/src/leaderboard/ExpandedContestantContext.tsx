import React, { createContext, useState } from 'react';
import { ExpandedContestantContextType } from './types';

const ExpandedContestantContext = createContext<ExpandedContestantContextType | undefined>(undefined);

const ExpandedContestantContextProvider: React.FC = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedUtl, setExpandedUtl] = useState<number>(null);

  return (
    <ExpandedContestantContext.Provider value={{
        selectedTab,
        setSelectedTab,
        expandedUtl,
        setExpandedUtl,
    }}>
      {children}
    </ExpandedContestantContext.Provider>
  );
};

export { ExpandedContestantContext, ExpandedContestantContextProvider };