const { resolve } = require('path');

const { appRepositoryRelativePath: appRepositoryPath } = require('./local.config.json');
const baseConfig = require('./webpack.config.base.js');
const hotExtension = require('./webpack.config.hot.js');
const rules = require('./webpack.config.rules.js');

module.exports = (env, { mode }) => {
    const { packageName, watchToApp, watchWithTypes, isNodeTarget } = env;
    const isProductionMode = mode === 'production';
    const packagePath = resolve(__dirname, `./packages/${packageName}/src/`);

    process.env.NODE_ENV = 'production';

    const options = {
        appRepositoryPath,
        packageName,
        packagePath,
        watchToApp
    };

    const config = baseConfig({
        isProductionMode,
        isNodeTarget,
        ...options,
        rules: rules({
            watchWithTypes: watchToApp && watchWithTypes,
            ...options
        })
    });

    return isProductionMode ? config : hotExtension(config, options);
};
