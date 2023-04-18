const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const fs = require('fs');

const { babelLoader } = require('../webpack.config.loaders');

const babelRcData = fs.readFileSync(resolve(__dirname, '.babelrc'), { encoding: 'utf-8' });
const babelRules = JSON.parse(babelRcData);

const baseCssLoaders = (isServerSideRendering, cssLoaderOptions = {}) => ([
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            emit: !isServerSideRendering
        }
    },
    {
        loader: 'css-loader',
        options: {
            ...cssLoaderOptions,
            modules: cssLoaderOptions.modules ? {
                localIdentName: '[local]--[hash:base64:5]',
                exportLocalsConvention: 'asIs',
                exportGlobals: true
            } : false
        }
    }
]);

const advancedCssLoaders = (isServerSideRendering, cssLoaderOptions = {}) => ([
    ...baseCssLoaders(isServerSideRendering, cssLoaderOptions),
    {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                ident: 'postcss'
            }
        }
    },
    {
        loader: 'sass-loader'
    }
]);

const tsLoaders = (isServerSideRendering, includeHotReload) => ([
    {
        loader: 'babel-loader',
        options: {
            ...babelRules,
            ...(isServerSideRendering && {
                plugins: [
                    ...babelRules.plugins,
                    '@react-ssr-pack/babel-plugin'
                ]
            }),
            ...(includeHotReload && {
                env: {
                    ...babelRules.env,
                    development: {
                        ...babelRules.env.development,
                        plugins: [
                            ...babelRules.env.development.plugins,
                            'react-refresh/babel'
                        ]
                    }
                }
            })
        }
    },
    {
        loader: 'ts-loader',
        options: {
            transpileOnly: true,
            compilerOptions: {
                paths: {
                    "*": [
                        "*"
                    ]
                }
            }
        }
    }
]);

module.exports = ({
    baseCssLoaders,
    advancedCssLoaders,
    tsLoaders
});
