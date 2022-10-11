import React from "react";
import { TabPanelProps } from "./types";


function TabPanel({
    index,
    selectedIndex,
    children,
}: TabPanelProps) {
    const shouldShow = selectedIndex === index;
    return (
        <div className='LigaBet-TabPanel' role='tabpanel' hidden={!shouldShow} >
            {shouldShow && children}
        </div>
    );
}

export default TabPanel;