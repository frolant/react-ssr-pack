const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { resolve } = require('path');

const libraryType = 'commonjs2';

module.exports = ({ isProductionMode, packageName, packagePath, watchToApp, appRepositoryPath, rules, isNodeTarget }) => ({
    mode: 'production',

    entry: resolve(__dirname, `./packages/${packageName}/src/index.ts`),

    output: {
        filename: 'index.js',
        pathinfo: false,
        path: watchToApp
            ? resolve(__dirname, `${appRepositoryPath}/node_modules/@react-ssr-pack/${packageName}/lib`)
            : resolve(__dirname, `./packages/${packageName}/lib`),
        library: {
            type: libraryType
        }
    },

    target: isNodeTarget ? 'node' : [
        'web',
        'es5'
    ],

    devtool: isNodeTarget ? false : 'source-map',

    externals: [
        nodeExternals({
            modulesDir: resolve(__dirname, './node_modules'),
            allowlist: [],
            importType: libraryType
        }),
        nodeExternals({
            modulesDir: resolve(__dirname, `./packages/${packageName}/node_modules`),
            allowlist: [],
            importType: libraryType
        }),
        /^@react-ssr-pack/i
    ],

    resolve: {
        modules: [
            __dirname,
            'node_modules'
        ],
        alias: {
            src: packagePath
        },
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx'
        ]
    },

    plugins: [
        ...(watchToApp ? [] : [
            new CleanWebpackPlugin()
        ]),

        new CaseSensitivePathsWebpackPlugin(),

        ...(isProductionMode ? [] : [
            new ESLintPlugin({
                extensions: [
                    'ts',
                    'tsx'
                ]
            })
        ])
    ],

    module: {
        rules
    },

    stats: {
        children: false
    },

    optimization: {
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        mangleExports: 'deterministic',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            })
        ]
    }
});
