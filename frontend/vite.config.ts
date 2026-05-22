import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig(({ mode }) => {
    const env = { ...loadEnv(mode, __dirname, ''), ...process.env }
    const isDev = mode === 'development'
    const analyze = env.ANALYZE === '1'
    const testSentryOnDev = env.TEST_SENTRY_ON_DEV === '1'
    return {
        plugins: [
            react(),
            tsconfigPaths(),
            svgr({ include: '**/*.svg' }),
            cssInjectedByJs(),
            analyze &&
                visualizer({
                    filename: path.resolve(__dirname, 'bundle-stats.html'),
                    open: true,
                    gzipSize: true,
                    brotliSize: true,
                }),
            (!isDev || testSentryOnDev) &&
                sentryVitePlugin({
                    org: 'ligabet-tzafon',
                    project: 'liga-bet-live',
                }),
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            outDir: path.resolve(__dirname, '../public/js/react-app'),
            emptyOutDir: true,
            sourcemap: true,
            minify: !isDev,
            modulePreload: false,
            rollupOptions: {
                input: path.resolve(__dirname, 'src/index.tsx'),
                output: {
                    entryFileNames: 'appMain.js',
                    chunkFileNames: isDev
                        ? 'chunk.[name].js'
                        : 'chunk.[name].[hash].js',
                    assetFileNames: isDev
                        ? '[name][extname]'
                        : '[name].[hash][extname]',
                },
            },
        },
    }
})
