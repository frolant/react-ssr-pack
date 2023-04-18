const { join } = require('path');

const ReactSSRPackResolvePlugin = require('@react-ssr-pack/resolve-plugin');

module.exports = (context, isServerSideRendering) => ({
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],

        extensions: [
            '.js',
            '.ts',
            '.tsx',
            '.scss'
        ],

        alias: {
            ...(isServerSideRendering && {
                react: join(context, '../node_modules/react'),
                // hexoid alias set only because of a webpack resolving bug:
                // https://github.com/node-formidable/formidable/issues/337
                // ...waiting for a fix
                hexoid: join(context, '../node_modules/hexoid/dist/index.js')
            })
        },

        ...(isServerSideRendering && {
            plugins: [
                // IMPORTANT:
                // The settings below are optional.
                // They are set only because of the specifics of the example app placed in the monorepository.
                // First, try just adding the plugin without parameters, or set only 'processingPath' if it's not './src' at your project.
                new ReactSSRPackResolvePlugin({
                    processingPath: join(context, '/src'),
                    originalPath: join(context, '../node_modules/react'),
                    overriddenPath: join(context, '../packages/react-proxy/lib/index.js')
                })
            ]
        })
    }
});
