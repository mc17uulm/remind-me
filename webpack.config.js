const { resolve, join } = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

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
            {loader: MiniCssExtractPlugin.loader},
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}}
        ]
    }, {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
            loader: "file-loader",
            options: {
                name: 'img/[name].[ext]',
                publicPath: '../'
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
                name: 'fonts/[name].[ext]',
                publicPath: '../'
            }
        }
    }
];

const get_all_files = (path, files, parent = '') => {

    const readFiles = fs.readdirSync(path);
    files = files || [];

    readFiles.forEach((file) => {
        if(fs.statSync(path + "/" + file).isDirectory()) {
            files = get_all_files(path + "/" + file, files, file);
        } else {
            files.push(join(parent, file));
        }
    });

    return files;

}

const get_entries = () => {
    const dir = resolve(__dirname, 'src', 'entries');

    const files = get_all_files(dir)
        .filter((file) => file.includes('.tsx') || file.includes('.ts'))
        .map((file) => file.replace('.tsx', '').replace('.ts', ''));

    let entry = {};
    files.forEach((file) => {
        const filename = file.replaceAll('\\', '/');
        const name = filename.toLowerCase().replaceAll('/', '.');
        entry[name] = {
            import: `./src/entries/${filename}`,
            dependOn: 'vendor'
        };
    });
    entry['vendor'] = ['react', 'react-dom'];
    return entry;
}

module.exports = (env, argv) => {

    return {
        name: "handler",
        entry: get_entries(),
        /**
        entry: {
            block: {
                import: './src/block',
                dependOn: 'vendor'
            },
            dashboard: {
                import: "./src/index",
                dependOn: 'vendor'
            },
            events: {
                import: "./src/events",
                dependOn: 'vendor'
            },
            subscribers: {
                import: "./src/subscribers",
                dependOn: 'vendor'
            },
            settings: {
                import: "./src/settings",
                dependOn: 'vendor'
            },
            templates: {
                import: "./src/templates",
                dependOn: 'vendor'
            },
            'new-form': {
                import: "./src/new-form",
                dependOn: 'vendor'
            },
            'edit-form': {
                import: './src/edit-form',
                dependOn: 'vendor'
            },
            vendor: ['react', 'react-dom']
        },*/
        optimization: {
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
                filename: 'css/remind-me-[name].css'
            }),
            new DependencyExtractionWebpackPlugin({injectPolyfill: true}),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                proxy: 'localhost:8080'
            })
        ],
        output: {
            filename: 'js/remind-me-[name].js',
            path: resolve(__dirname, 'dist/')
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"]
        },
        mode: argv.mode
    }
}