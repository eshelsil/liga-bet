import React from 'react'
import { render } from 'react-dom'
import i18n from './i18n/config'
import { applyDocumentDirection } from './i18n/direction'

// Match the document direction to the stored language before first paint
// (avoids an RTL->LTR flash for users whose saved language is English).
applyDocumentDirection(i18n.language)

const App = React.lazy(() => import('./App'))

render(
    <React.Suspense fallback={null}>
        <App />
    </React.Suspense>,
    document.getElementById('root')
)
