import React from 'react';
import { Tab } from '@mui/material';
import { SimpleTabsProps } from './types';
import TabPanel from './TabPanel';
import StyledTabs from './StyledTabs';
import './Tabs.scss';


function SimpleTabs({
    tabs,
    tabsProps,
    onChange,
    index: selectedIndex = 0,
}: SimpleTabsProps) {

    function handleChange(e: unknown, newIndex: number){
        onChange(newIndex);
    }

    return (
        <div className='LigaBet-Tabs'>
            <StyledTabs
                value={selectedIndex}
                onChange={handleChange}
                variant='fullWidth'
                {...tabsProps}
            >
            {tabs.map( ({id, label}, index) => (
                <Tab
                    key={id}
                    label={label}
                />
            ))}
            </StyledTabs>
            {tabs.map( ({id, children}, index) => (
                <TabPanel
                    key={id}
                    children={children}
                    index={index}
                    selectedIndex={selectedIndex}
                />
            ))}
        </div>
    );
}

export default SimpleTabs;