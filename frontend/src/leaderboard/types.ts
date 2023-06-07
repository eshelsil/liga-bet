export interface TableConfig {
    liveMode: boolean,
    upToDateMode: boolean,
    showChange: boolean,
    originVersionId?: number,
    destinationVersionId?: number,
}

export type ExpandedContestantContextType = {
    selectedTab: number,
    setSelectedTab: (tab: number) => void,
    expandedUtl: number,
    setExpandedUtl: (id: number) => void,
}  