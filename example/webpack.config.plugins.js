const webpack = require('webpack');
const { join } = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const { progressPluginHandler } = require('@web-dev-tools/webpack-progress-plugin-handler');

const { serverConfig, getOutputGroupName } = require('./webpack.config.utils');

const { host, devServerPort, serverSideRenderingPort } = serverConfig;

module.exports = ({ context, entryPointConfig, includeHotReload, isProductionMode, isDebugSSRMode, isTestProductionMode }) => {
    const { isServerSideRendering, entryPointName } = entryPointConfig;
    const backendHost = isServerSideRendering ? `http://${host}:${devServerPort}` : '';
    const serverDistPath = join(context, '/dist/server');

    return {
        plugins: [
            new MiniCssExtractPlugin({
                filename: (data) => `styles/${getOutputGroupName(data)}.bundle.[id].css`,
                chunkFilename : (data) => `styles/${getOutputGroupName(data)}.chunk.[id].css`,
                runtime: isProductionMode || includeHotReload
            }),

            new webpack.DefinePlugin({
                ...(isServerSideRendering && {
                    'global.GENTLY': JSON.stringify(false)
                }),
                __SERVER_SIDE_RENDERING_PORT__: JSON.stringify(serverSideRenderingPort),
                __IS_PRODUCTION_MODE__: JSON.stringify(isProductionMode),
                __IS_TRACE_SSR_MODE__: JSON.stringify(isDebugSSRMode),
                __HOST__: JSON.stringify(backendHost)
            }),

            new CaseSensitivePathsWebpackPlugin(),

            new webpack.ProgressPlugin((percentage, message, ...args) => {
                progressPluginHandler(entryPointName, percentage, message, args);
            }),

            ...(!isServerSideRendering ? [
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/resources',
                        }
                    ]
                }),

                new HtmlWebpackPlugin({
                    hash: true,
                    template: 'src/template.ejs',
                    filename: '../server/template.html',
                    scriptLoading: 'defer'
                }),

                ...(isProductionMode || isTestProductionMode ? [
                    new CompressionPlugin({
                        test: /\.(js|css)$/i
                    })
                ] : []),

                ...(!isProductionMode || isTestProductionMode ? [
                    new ForkTsCheckerWebpackPlugin(),

                    new ESLintPlugin({
                        lintDirtyModulesOnly: true,
                        extensions: [
                            'ts',
                            'tsx'
                        ]
                    }),

                    new StylelintPlugin({
                        lintDirtyModulesOnly: true,
                        allowEmptyInput: true,
                        context: 'src',
                        quiet: false,
                        files: [
                            '**/*.scss'
                        ]
                    }),

                    new NodemonPlugin({
                        script: serverDistPath,
                        watch: serverDistPath,
                        delay: '1000',
                        quiet: true,
                        ext: 'js'
                    })
                ] : []),

                ...(!isProductionMode ? [
                    new webpack.HotModuleReplacementPlugin(),

                    ...(includeHotReload ? [
                        new ReactRefreshWebpackPlugin()
                    ] : [])
                ] : []),
            ] : [])
        ]
    }
};
