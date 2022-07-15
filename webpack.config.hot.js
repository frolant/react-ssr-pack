const { resolve } = require('path');

const CopyScheduleWebpackPlugin = require('./tools/plugins/CopyScheduleWebpackPlugin');

module.exports = (config, { appRepositoryPath, packageName, watchToApp }) => ({
    ...config,

    watch: true,

    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000,
        ignored: /node_modules/
    },

    plugins: [
        ...config.plugins,

        ...(watchToApp ? [
            new CopyScheduleWebpackPlugin({
                sourcePath: resolve(__dirname, `./packages/${packageName}/lib`),
                destinationPath: resolve(__dirname, `${appRepositoryPath}/node_modules/@react-ssr-pack/${packageName}/lib`),
                copyOnFirstReBuildIterationOnly: true
            })
        ] : [])
    ]
});
