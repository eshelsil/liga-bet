import { keyBy } from 'lodash'
import { Route } from './types'

const routes: Route[] = [
    {
        path: 'leaderboard',
        label: 'טבלת ניקוד',
        iconClass: 'podium_icon',
    },
    {
        path: 'open-matches',
        label: 'ניחוש משחקים',
        iconClass: 'bet_icon',
    },
    {
        path: 'closed-matches',
        label: 'צפייה בהימורים',
        iconClass: 'watch_bets_icon',
    },
    {
        path: 'open-group-standings',
        label: 'ניחוש דירוגי בתים',
    },
    {
        path: 'open-questions',
        label: 'ניחושים מיוחדים',
    },
    {
        path: 'all-group-standings',
        label: 'צפייה בהימורי בתים',
    },
    {
        path: 'all-questions',
        label: 'צפייה בהימורים מיוחדים',
    },
    {
        path: 'my-bets',
        label: 'הטופס שלי',
        iconClass: 'form_icon',
    },
    {
        path: 'set-password',
        label: 'שנה סיסמה',
        iconClass: 'change_password_icon',
    },
    {
        path: 'choose-utl',
        label: 'טורנירים',
    },
    {
        path: 'contestants',
        label: 'נהל משתתפים',
    },
    {
        path: 'profile',
        label: 'הפרופיל שלי',
    },
    {
        path: 'takanon',
        label: 'תקנון',
    },
    {
        path: 'logout',
        label: 'התנתק',
        iconClass: 'logout_icon',
    },
    {
        path: 'tournament-config',
		label: 'הגדרות טורניר',
    },
    {
        path: 'tournament-score-config',
		label: 'הגדרות טורניר',
    },
    {
        path: 'invite-friends',
		label: 'הזמן חברים',
    },
    
]

export const routesMap = keyBy(routes, 'path')
