const { resolve } = require('path');

const { babelLoader, tsLoader } = require('./webpack.config.loaders.js');

module.exports = ({ packageName, watchToApp, appRepositoryPath }) => ([
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: tsLoader({
            watchToApp,
            appRepositoryPath,
            packageName
        })
    },

    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: babelLoader
    }
]);
