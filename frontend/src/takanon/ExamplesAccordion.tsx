import React, { useState } from 'react';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';


function ExamplesAccordion({children}) {
    const { t } = useTranslation('takanon')
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        <div className='LB-ExamplesAccordion'>
            <div className='LB-ExamplesAccordion-link' onClick={toggleOpen}>
                <div className='LB-ExamplesAccordion-link-title'>{t('examples.title')}</div>
                <ArrowDownIcon className={`expandArrowIcon ${isOpen ? 'arrowUp' : ''}`} />
            </div>
            <Collapse in={isOpen}>
                {children}
			</Collapse>
        </div>
    )
}

export default ExamplesAccordion
