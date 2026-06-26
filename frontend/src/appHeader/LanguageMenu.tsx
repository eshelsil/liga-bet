import React from 'react'
import { CircleFlag } from 'react-circle-flags'
import MenuItemMUI from '@mui/material/MenuItem'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { useLanguage, AppLanguage } from '../i18n'
import './LanguageMenu.scss'

interface LanguageOption {
    code: AppLanguage
    label: string
    countryCode: string
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
    { code: 'he', label: 'עברית', countryCode: 'il' },
    { code: 'en', label: 'English', countryCode: 'us' },
]

function LanguageMenu() {
    const themeClass = useTournamentThemeClass()
    const { language, changeLanguage } = useLanguage()

    const current =
        LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0]

    return (
        <div className="LigaBet-LanguageMenu">
            <PopupMenu
                anchorContent={
                    <div className="LanguageMenu-anchor" aria-label="change language">
                        <CircleFlag countryCode={current.countryCode} height={24} width={24} />
                    </div>
                }
                classes={{ list: themeClass }}
            >
                {LANGUAGE_OPTIONS.map((option) => (
                    <MenuItemMUI
                        key={option.code}
                        className={`LigaBet-LanguageMenuItem ${
                            option.code === language ? 'LB-ActivePathItem' : ''
                        }`}
                        onClick={() => changeLanguage(option.code)}
                    >
                        <CircleFlag countryCode={option.countryCode} height={20} width={20} />
                        <span className="LanguageMenu-label">{option.label}</span>
                    </MenuItemMUI>
                ))}
            </PopupMenu>
        </div>
    )
}

export default LanguageMenu
