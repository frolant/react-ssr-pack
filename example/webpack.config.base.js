const { resolve, join } = require('path');
const dotenv = require('dotenv');

const getOptimizationConfig = require('./webpack.config.optimization.js');
const getPluginsConfig = require('./webpack.config.plugins');
const getDevServerConfig = require('./webpack.config.devserver.js');
const getResolveConfig = require('./webpack.config.resolve.js');
const getRulesConfig = require('./webpack.config.rules.js');

const { getOutputScriptFileName } = require('./webpack.config.utils.js');

module.exports = ({ entryPointConfig, argv, env }) => {
    const context = process.cwd();

    const { entryPointName, isServerSideRendering = false, useHotReload = false } = entryPointConfig;
    const { mode } = argv;

    const isTestProductionMode = !!env['production-mode'];
    const isProductionMode = mode === 'production' || isTestProductionMode;
    const isDebugSSRMode = !!env['debug-ssr-mode'];

    const includeLiveReload = !isProductionMode && !isServerSideRendering;
    const includeHotReload = includeLiveReload && useHotReload;
    const runDevServer = includeHotReload || useHotReload;

    process.env.NODE_ENV = isProductionMode ? 'production' : 'development';

    if (!isProductionMode) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    dotenv.config({
        path: resolve(__dirname, '../../.env.local')
    });

    return {
        mode,

        context,

        entry: {
            [entryPointName]: [
                ...(includeLiveReload ? [
                    'webpack/hot/dev-server.js',
                    'webpack-dev-server/client/index.js?hot=true&live-reload=true',
                ] : []),
                entryPointConfig.path
            ]
        },

        target: isServerSideRendering ? 'node' : [
            'web',
            'es5'
        ],

        devtool: isServerSideRendering ? false : isProductionMode ? 'nosources-source-map' : 'cheap-module-source-map',

        output: {
            uniqueName: entryPointName,
            path: join(context, `/dist/${isServerSideRendering ? 'server' : 'client'}`),
            filename: (data) => data.chunk.name === 'server' ? 'index.js' : getOutputScriptFileName(data, 'bundle', isServerSideRendering),
            chunkFilename: (data) => getOutputScriptFileName(data, 'chunk', isServerSideRendering),
            publicPath: '/',
            ...(isServerSideRendering && {
                library: {
                    type: 'commonjs2'
                }
            })
        },

        module: {
            rules: getRulesConfig(context, isServerSideRendering, includeHotReload)
        },

        snapshot: {
            managedPaths: []
        },

        ...getResolveConfig(context, isServerSideRendering),

        ...(runDevServer && getDevServerConfig(isTestProductionMode)),

        ...getPluginsConfig({
            isDebugSSRMode,
            isProductionMode,
            isTestProductionMode,
            includeHotReload,
            entryPointConfig,
            context,
            argv
        }),

        ...getOptimizationConfig(isProductionMode, isServerSideRendering, includeHotReload),

        stats: isProductionMode ? 'normal' : {
            preset: 'errors-warnings',
            entrypoints: true,
            modules: true,
            modulesSpace: 4,
            timings: true
        },

        performance: {
            maxEntrypointSize: 5120000,
            maxAssetSize: 5120000,
            ...(isServerSideRendering && {
                hints: false
            })
        },

        ...(isServerSideRendering && {
            node: {
                __dirname: false,
                __filename: false
            }
        }),

        // Hide warning for express usage in ssr build
        // https://github.com/node-formidable/formidable/issues/337
        ignoreWarnings: [
            {
                module: /node_modules[\\/]express[\\/]lib[\\/]view.js/,
                message: /Critical dependency: the request of a dependency is an expression/
            },
            {
                module: /node_modules[\\/]formidable[\\/]src[\\/]Formidable.js/,
                message: /Critical dependency: the request of a dependency is an expression/
            }
        ]
    };
};
