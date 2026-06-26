import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CurrentTournamentOwner } from '../_selectors';


function Disclaimer() {
    const { t } = useTranslation('takanon')
    const owner = useSelector(CurrentTournamentOwner)
    return (<>
        <h4 style={{marginTop: 4}}>{t('disclaimer.heading')}</h4>
        <ul>
            <li>
                {t('disclaimer.text', { owner: owner?.name })}
            </li>
        </ul>
    </>);
};

export default Disclaimer;
