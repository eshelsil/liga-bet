import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
    Badge,
    Button,
    Dialog,
    DialogContent,
    IconButton,
} from '@mui/material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CloseIcon from '@mui/icons-material/Close'
import { WinnerSide } from '../types'
import {
    KnockoutClosedMatchBetsSelector,
    MissingGameBetsCount,
} from '../_selectors'
import SimpleTabs from '../widgets/Tabs/Tabs'
import BracketGamesList from './BracketGamesList'
import BracketSpectatorView from './BracketSpectatorView'
import ContestantPicksTable from './ContestantPicksTable'
import KnockoutClosedMatchBetsProvider from '../matches/KnockoutClosedMatchBetsProvider'
import './Bracket.scss'

// The post-start "Predictions" layout for a knockout-bracket tournament:
//   • two buttons → the live Bracket and the Winner/Runner-Up table, each in a modal
//   • two tabs → "My bets" (your open game bets) and "Games" (live + past, with gamblers)
// "My bets" is always the default; the Games tab pulses while a live game is running.
function BracketStartedView({
    sendMatchBet,
}: {
    sendMatchBet: (args: {
        matchId: number
        homeScore: string
        awayScore: string
        koWinner: WinnerSide
    }) => Promise<void>
}) {
    const { t } = useTranslation('knockout_bracket')
    const missingCount = useSelector(MissingGameBetsCount)
    const { live_matches } = useSelector(KnockoutClosedMatchBetsSelector)
    const hasLiveGame = live_matches.length > 0

    const [selectedTab, setSelectedTab] = useState(0)
    const [bracketOpen, setBracketOpen] = useState(false)
    const [picksOpen, setPicksOpen] = useState(false)

    const tabs = [
        {
            id: 'my-bets',
            label: (
                <Badge
                    color="error"
                    variant="dot"
                    invisible={missingCount === 0}
                >
                    <span>{t('startedView.tabs.myBets')}</span>
                </Badge>
            ),
            children: <BracketGamesList sendMatchBet={sendMatchBet} />,
        },
        {
            id: 'games',
            label: (
                <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasLiveGame || selectedTab === 1}
                    classes={{ badge: 'BracketTab-pulseDot' }}
                >
                    <span>{t('startedView.tabs.games')}</span>
                </Badge>
            ),
            children: <KnockoutClosedMatchBetsProvider />,
        },
    ]

    return (
        <div className="LB-Bracket LB-BracketStartedView LB-BracketView-enter">
            <div className="BracketStartedView-actions">
                <Button
                    variant="outlined"
                    startIcon={<AccountTreeIcon />}
                    onClick={() => setBracketOpen(true)}
                >
                    {t('startedView.actions.bracket')}
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<EmojiEventsIcon />}
                    onClick={() => setPicksOpen(true)}
                >
                    {t('startedView.actions.picksTable')}
                </Button>
            </div>

            <SimpleTabs
                tabs={tabs}
                index={selectedTab}
                onChange={setSelectedTab}
            />

            <Dialog
                className="LB-BracketModal"
                open={bracketOpen}
                onClose={() => setBracketOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <IconButton
                    className="BracketModal-close"
                    aria-label={t('startedView.close')}
                    onClick={() => setBracketOpen(false)}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <BracketSpectatorView />
                </DialogContent>
            </Dialog>

            <Dialog
                className="LB-PicksModal"
                open={picksOpen}
                onClose={() => setPicksOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <IconButton
                    className="BracketModal-close"
                    aria-label={t('startedView.close')}
                    onClick={() => setPicksOpen(false)}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <h3 className="LB-TitleText PicksModal-title">
                        {t('startedView.actions.picksTable')}
                    </h3>
                    <ContestantPicksTable />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BracketStartedView
