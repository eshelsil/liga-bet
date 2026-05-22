import React from 'react'
import { render } from 'react-dom'

const App = React.lazy(() => import('./App'))

render(
    <React.Suspense fallback={null}>
        <App />
    </React.Suspense>,
    document.getElementById('root')
)
