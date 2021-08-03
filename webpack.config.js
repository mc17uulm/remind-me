const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
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
];

module.exports = {
    name: "handler",
    entry: {
        blocks: './src/block',
        dashboard: "./src/index",
        events: "./src/events",
        subscribers: "./src/subscribers",
        settings: "./src/settings",
        templates: './src/templates',
        'new-form': "./src/new-form",
        'edit-form': './src/edit-form'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
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
        }),
        new DependencyExtractionWebpackPlugin({injectPolyfill: true})
    ],
    output: {
        filename: 'js/wp-reminder-[name]-handler.js',
        path: resolve(__dirname, 'dist/'),
        publicPath: base
    },
    externals: {
        '@wordpress/i18n': "wp.i18n",
        'react': {
            root: 'React',
            esm: 'react-is',
            commonjs: 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
        }
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"]
    },
    mode: mode ? 'development' : 'production'
}