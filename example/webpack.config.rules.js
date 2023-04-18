const { join } = require('path');

const { baseCssLoaders, advancedCssLoaders, tsLoaders } = require('./webpack.config.loaders');

module.exports = (context, isServerSideRendering, includeHotReload) => ([
    {
        test: /\.css$/,
        include: /node_modules/,
        use: baseCssLoaders(isServerSideRendering)
    },

    {
        test: /\.scss$/,
        include: join(context,'/src'),
        use: advancedCssLoaders(isServerSideRendering, {
            url: false,
            importLoaders: 1,
            modules: true
        })
    },

    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: tsLoaders(isServerSideRendering, includeHotReload)
    },

    {
        test: /\.(svg|png|jpg|gif)$/,
        oneOf: [
            {
                exclude: /node_modules/,
                issuer: /\.s?css$/,
                type: isServerSideRendering ? 'asset/source' : 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            }
        ]
    }
]);
