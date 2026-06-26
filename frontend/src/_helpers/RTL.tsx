import React from 'react'
import rtlPlugin from 'stylis-plugin-rtl'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import { Direction } from '../i18n/direction'

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
})

const cacheLtr = createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
})

interface Props {
    children: React.ReactNode
    direction?: Direction
}

export default function RTL({ children, direction = 'rtl' }: Props) {
    const cache = direction === 'rtl' ? cacheRtl : cacheLtr
    return <CacheProvider value={cache}>{children}</CacheProvider>
}
