const checkSSRAvailability = require('@react-ssr-pack/server-checker');

const { serverConfig } = require('./webpack.config.utils');

const { host, devServerPort, serverSideRenderingPort, devServerMaxTimeout } = serverConfig;
const serverSideRenderingProxyTimeout = devServerMaxTimeout * 1000;
const serverSideRenderingHost = `http://${host}:${serverSideRenderingPort}`;

module.exports = () => ({
    devServer: {
        host: host,
        port: devServerPort,
        client: false,
        static: false,
        hot: false,
        allowedHosts: 'all',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        server: {
            type: 'http'
        },
        devMiddleware: {
            writeToDisk: (path) => /[\\/]server[\\/]/.test(path),
            index: false
        },
        proxy: {
            '**': {
                target: serverSideRenderingHost,
                bypass: async () => await checkSSRAvailability(),
                proxyTimeout: serverSideRenderingProxyTimeout,
                timeout: serverSideRenderingProxyTimeout
            }
        }
    }
});
