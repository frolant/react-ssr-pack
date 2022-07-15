const { resolve } = require('path');

const { babelLoader, tsLoader } = require('./webpack.config.loaders.js');

module.exports = ({ packageName, watchWithTypes, appRepositoryPath }) => ([
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: tsLoader({
            watchWithTypes,
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
