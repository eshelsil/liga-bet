import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { SimpleTabsProps } from './types';
import TabPanel from './TabPanel';
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
            <Tabs
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
            </Tabs>
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