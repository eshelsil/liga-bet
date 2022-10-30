import React from 'react'
import AppLink, { AppLinkProps } from './AppLink'

interface AppLinkDescription extends AppLinkProps {
    id: string
    isAdminView?: boolean
}

type AppLinksConfig = Record<string, AppLinkDescription>

const appLinks: AppLinksConfig = {
	// articles: {
	// 	id: 'articles',
	// 	path: '/articles',
	// 	label: 'כתבות',
	// },
	takanon: {
		id: 'takanon',
		path: '/takanon',
		label: 'תקנון',
		hasReactComponent: true,
	},
	adminTools: {
		id: 'adminTools',
		path: '/admin/index',
		label: 'Admin Tools',
		isAdminView: true,
	},
	manageUsers: {
		id: 'manageUsers',
		path: '/admin/users',
		label: 'Manage users',
		hasReactComponent: true,
		isAdminView: true,
	},
};

interface Props {
    isAdmin: boolean
}

function AppLinksView({ isAdmin }: Props) {
    return (
        <>
            {Object.values(appLinks).map(
                ({ id, isAdminView, ...appLinkProps }) => {
                    const hidden = isAdminView && !isAdmin
                    return (
                        <React.Fragment key={id}>
                            {!hidden && <AppLink {...appLinkProps} />}
                        </React.Fragment>
                    )
                }
            )}
        </>
    )
}

export default AppLinksView
