const TerserPlugin = require('terser-webpack-plugin');

const defaultChunksOptions = {
    reuseExistingChunk: true,
    enforce: true,
    chunks: 'all'
}

const getDefaultChunksOptions = (name, isServerSideRendering) => ({
    ...defaultChunksOptions,
    ...(isServerSideRendering && {
        name
    })
});

module.exports = (isProductionMode, isServerSideRendering, includeHotReload) => ({
    optimization: {
        chunkIds: 'total-size',
        moduleIds: 'size',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    ...getDefaultChunksOptions('vendors', isServerSideRendering),
                    test: /node_modules/,
                    priority: -1
                },
                application: {
                    ...getDefaultChunksOptions('application', isServerSideRendering),
                    test: /src/,
                    priority: -2
                }
            }
        },
        ...(isProductionMode ? {
            minimize: !isServerSideRendering,
            minimizer: [
                new TerserPlugin({
                    extractComments: true,
                    parallel: true
                })
            ]
        } : {
            runtimeChunk: includeHotReload ? 'single' : false
        })
    }
});
