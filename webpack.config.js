const { resolve } = require('path');

const exclude = [
    /node_modules/,
    /dist/,
    /vendor/
]

module.exports = {
    name: "handler",
    entry: {
        dashboard: "./src/index",
        events: "./src/events",
        subscribers: "./src/subscribers",
        settings: "./src/settings"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: exclude,
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.(ts|tsx)$/,
                exclude: exclude,
                use: {
                    loader: "ts-loader"
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?-url', 'sass-loader']
            }, {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: '/wp-content/plugins/_wp_reminder/dist/img/'
                    }
                }
            }, {
                test: /\.svg$/,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        limit: 10000
                    }
                }
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '/wp-content/plugins/_wp_reminder/dist/fonts/'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'js/wp-reminder-[name]-handler.js',
        path: resolve(__dirname, 'dist/')
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"]
    }
}