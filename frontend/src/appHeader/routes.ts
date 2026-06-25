import { keyBy } from 'lodash'
import i18n from '@/i18n/config'
import { Route } from './types'

const routes: Route[] = [
    {
        path: 'leaderboard',
        get label() { return i18n.t('appHeader:routes.leaderboard') },
        iconClass: 'podium_icon',
    },
    {
        path: 'open-matches',
        get label() { return i18n.t('appHeader:routes.openMatches') },
        iconClass: 'bet_icon',
    },
    {
        path: 'bracket',
        get label() { return i18n.t('appHeader:routes.bracket') },
        iconClass: 'bet_icon',
    },
    {
        // knockout_bracket "Open Guesses" — same /open-matches route, bracket-flavoured label.
        id: 'open-guesses',
        path: 'open-matches',
        get label() { return i18n.t('appHeader:routes.openGuesses') },
        iconClass: 'bet_icon',
    },
    {
        id: 'closed-bets',
        path: 'closed-bets/:tab?',
        get label() { return i18n.t('appHeader:routes.closedBets') },
        iconClass: 'watch_bets_icon',
    },
    {
        path: 'open-group-standings',
        get label() { return i18n.t('appHeader:routes.openGroupStandings') },
    },
    {
        path: 'open-questions',
        get label() { return i18n.t('appHeader:routes.openQuestions') },
    },
    {
        path: 'all-group-standings',
        get label() { return i18n.t('appHeader:routes.allGroupStandings') },
    },
    {
        path: 'all-questions',
        get label() { return i18n.t('appHeader:routes.allQuestions') },
    },
    {
        path: 'my-bets',
        get label() { return i18n.t('appHeader:routes.myBets') },
        iconClass: 'form_icon',
    },
    {
        path: 'set-password',
        get label() { return i18n.t('appHeader:routes.setPassword') },
        iconClass: 'change_password_icon',
    },
    {
        path: 'choose-utl',
        get label() { return i18n.t('appHeader:routes.chooseUtl') },
    },
    {
        path: 'contestants',
        get label() { return i18n.t('appHeader:routes.contestants') },
    },
    {
        path: 'profile',
        get label() { return i18n.t('appHeader:routes.profile') },
    },
    {
        path: 'nihusim',
        get label() { return i18n.t('appHeader:routes.nihusim') },
    },
    {
        path: 'takanon',
        get label() { return i18n.t('appHeader:routes.takanon') },
    },
    {
        path: 'logout',
        get label() { return i18n.t('appHeader:routes.logout') },
        iconClass: 'logout_icon',
    },
    {
        path: 'tournament-config',
        get label() { return i18n.t('appHeader:routes.tournamentConfig') },
    },
    {
        path: 'tournament-score-config',
        get label() { return i18n.t('appHeader:routes.tournamentScoreConfig') },
    },
    {
        path: 'invite-friends',
        get label() { return i18n.t('appHeader:routes.inviteFriends') },
    },
    {
        path: 'admin/index',
        label: 'Admin Tools',
    },

]

export const routesMap = keyBy(routes, route => route.id ?? route.path)
