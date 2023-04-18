const { resolve } = require('path');

const getWebpackConfig = require('./webpack.config.base');

module.exports = (env, argv) => {
    return [
        {
            entryPointName: 'server',
            path: resolve(__dirname, `./src/server.ts`),
            isServerSideRendering: true
        },
        {
            entryPointName: 'client',
            path: resolve(__dirname, `./src/client.ts`),
            useHotReload: true
        }
    ].map((entryPointConfig) => getWebpackConfig({
        entryPointConfig,
        argv,
        env
    }));
};
