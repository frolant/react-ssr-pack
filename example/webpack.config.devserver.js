const { serverConfig, checkServerSideRenderingAvailability } = require('./webpack.config.utils');

const { host, devServerPort, serverSideRenderingPort, devServerMaxTimeout } = serverConfig;
const serverSideRenderingProxyTimeout = devServerMaxTimeout * 1000;
const serverSideRenderingHost = `http://${host}:${serverSideRenderingPort}`;

module.exports = (isTestProductionMode) => ({
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
            writeToDisk: isTestProductionMode ? true : (path) => /[\\/]server[\\/]/.test(path),
            index: false
        },
        proxy: {
            '**': {
                target: serverSideRenderingHost,
                bypass: checkServerSideRenderingAvailability(serverSideRenderingHost),
                proxyTimeout: serverSideRenderingProxyTimeout,
                timeout: serverSideRenderingProxyTimeout
            }
        }
    }
});
