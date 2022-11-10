import React, { useState } from 'react';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Collapse } from '@mui/material';


function ExamplesAccordion({children}) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        <div className='LB-ExamplesAccordion'>
            <div className='LB-ExamplesAccordion-link' onClick={toggleOpen}>
                <div className='LB-ExamplesAccordion-link-title'>דוגמאות</div>
                <ArrowDownIcon className={`expandArrowIcon ${isOpen ? 'arrowUp' : ''}`} />
            </div>
            <Collapse in={isOpen}>
                {children}
			</Collapse>
        </div>
    )
}

export default ExamplesAccordion
