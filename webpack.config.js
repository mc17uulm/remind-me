const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const TerserPlugin = require("terser-webpack-plugin");
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const mode = process.env.NODE_ENV !== 'production';

const base = '/wp-content/plugins/wp-reminder/';

const exclude = [
    /node_modules/,
    /dist/,
    /vendor/
];

const rules = [
    {
        test: /\.(js|jsx)$/,
        exclude: exclude,
        use: {
            loader: "esbuild-loader",
            options: {
                loader: 'jsx',
                target: 'es2015'
            }
        }
    }, {
        test: /\.(ts|tsx)$/,
        exclude: exclude,
        use: {
            loader: "esbuild-loader",
            options: {
                loader: 'tsx',
                target: 'es2015'
            }
        }
    }, {
        test: /\.s?[ac]ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}}
        ]
    }, {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
            loader: "file-loader",
            options: {
                name: '[name].[ext]',
                outputPath: 'img/',
                publicPath: `${base}dist/img/`
            }
        }
    }, {
        test: /\.svg$/,
        use: {
            loader: "svg-url-loader",
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
                publicPath: `${base}dist/fonts/`
            }
        }
    }
]

module.exports = {
    name: "handler",
    entry: {
        dashboard: "./src/index",
        events: "./src/events",
        subscribers: "./src/subscribers",
        settings: "./src/settings",
        'new-form': "./src/new-form",
        'edit-form': './src/edit-form'
    },
    optimization: {
        minimizer: [
            new ESBuildMinifyPlugin({
                terserOptions: {
                    keep_fnames: false
                },
                target: 'es2015'
            })
        ]
    },
    module: {
        rules: rules
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/wp-reminder-[name]-style.css'
        })
    ],
    output: {
        filename: 'js/wp-reminder-[name]-handler.js',
        path: resolve(__dirname, 'dist/'),
        publicPath: base
    },
    externals: {'@wordpress/i18n': "wp.i18n"},
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"]
    },
    mode: mode ? 'development' : 'production'
}