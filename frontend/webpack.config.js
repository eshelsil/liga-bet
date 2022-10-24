const path = require('path')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../public/js'),
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
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            }
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    devtool: prod ? undefined : 'source-map',
    plugins: [],
    mode: prod ? 'production' : 'development',
}

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// module.exports = {
//   mode: prod ? 'production' : 'development',
//   entry: './src/index.tsx',
//   output: {
//     path: __dirname + '/dist/',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(ts|tsx)$/,
//         exclude: /node_modules/,
//         resolve: {
//           extensions: ['.ts', '.tsx', '.js', '.json'],
//         },
//         use: 'ts-loader',
//       },
//       {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader'],
//       },
//     ]
//   },
//   devtool: prod ? undefined : 'source-map',
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: 'index.html',
//     }),
//     new MiniCssExtractPlugin(),
//   ],
// };
