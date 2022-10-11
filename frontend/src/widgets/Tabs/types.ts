import  { ReactNode } from "react";
import { TabsProps } from "@mui/material";


export interface TabPanelProps {
    index: number,
    selectedIndex: number,
    children: ReactNode,
}


export interface TabDescription {
    label: string,
    id: string,
    children: ReactNode
}

export interface SimpleTabsProps {
    tabs: TabDescription[],
    index: number,
    onChange: (index: number) => void,
    tabsProps?: TabsProps,
}