const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const prod = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'appMain.js',
        chunkFilename: 'chunk.[name].[chunkhash].js',
        path: path.resolve(__dirname, '../public/js/react-app'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx', '.js', '.json'],
                },
                use: 'ts-loader',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('autoprefixer'),
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            }
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        plugins: [
            new TsconfigPathsPlugin(),
        ],
    },
    devtool: prod ? undefined : 'source-map',
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
    mode: prod ? 'production' : 'development',
}