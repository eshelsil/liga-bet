import React from 'react';
import { Tabs } from '@mui/material';
import { styled } from '@mui/styles';


const StyledTabs = styled(Tabs)({
    background: 'rgba(255,255,255, 0.9)',
    borderRadius: 12,
    '& .MuiTab-root.Mui-selected': {
        filter: 'brightness(0.8)',
        background: 'rgba(255,255,255, 0.4)',
    }
})

export default StyledTabs;