const { resolve } = require('path');

module.exports = {
    name: "handler",
    entry: "./src/index.ts",
    modules: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules/,
                    /dist/,
                    /vendor/
                ],
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.(ts|tsx)$/,
                exclude: [
                    /node_modules/,
                    /dist/,
                    /vendor/
                ],
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
                    loader: 'file-loader?name=/img/[name].[ext]'
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
                        outputPath: 'fonts/'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'js/wp-reminder-handler.js',
        path: resolve(__dirname, 'dist/')
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"]
    }
}